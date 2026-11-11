import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category = 'SHORT_STORY',
      bookTitle = '',
      chapterNumber = 1,
      authorName = 'எம். தயாளன் (M. Thayalan)',
      language = 'ta',
      readingTimeMinutes = 6,
      isFeatured = false,
      isPublished = true,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const cleanSlug =
      (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9\u0B80-\u0BFF]+/g, '-')
        .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

    const plainTextExcerpt =
      excerpt ||
      content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180) + '...';

    const post = await prisma.post.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: plainTextExcerpt,
        content,
        category,
        bookTitle,
        chapterNumber: Number(chapterNumber) || 1,
        authorName,
        language,
        readingTimeMinutes: Number(readingTimeMinutes) || 5,
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post (ensure slug is unique)' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      bookTitle,
      chapterNumber,
      authorName,
      language,
      readingTimeMinutes,
      isFeatured,
      isPublished,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        bookTitle: bookTitle || '',
        chapterNumber: Number(chapterNumber) || 1,
        authorName,
        language,
        readingTimeMinutes: Number(readingTimeMinutes) || 5,
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

