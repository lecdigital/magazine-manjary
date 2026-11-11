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
  const issues = await prisma.magazineIssue.findMany({
    orderBy: { issueNumber: 'desc' },
  });
  return NextResponse.json({ issues });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      issueNumber,
      month,
      year,
      title,
      subtitle = '',
      description = '',
      highlights = '',
      coverImageUrl,
      pdfUrl,
      isPublished = true,
    } = body;

    const issue = await prisma.magazineIssue.create({
      data: {
        issueNumber: Number(issueNumber),
        month,
        year: Number(year),
        title,
        subtitle,
        description,
        highlights,
        coverImageUrl:
          coverImageUrl ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
        pdfUrl: pdfUrl || `/sample-issues/manjary-issue-${issueNumber}.pdf`,
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json({ issue });
  } catch (error) {
    console.error('Error creating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to create magazine issue (check unique issueNumber)' },
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
      issueNumber,
      month,
      year,
      title,
      subtitle = '',
      description = '',
      highlights = '',
      coverImageUrl,
      pdfUrl,
      isPublished,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing issue id' }, { status: 400 });
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: {
        issueNumber: Number(issueNumber),
        month,
        year: Number(year),
        title,
        subtitle,
        description,
        highlights,
        coverImageUrl,
        pdfUrl,
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json({ issue });
  } catch (error) {
    console.error('Error updating magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to update magazine issue' },
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
      return NextResponse.json({ error: 'Missing issue id' }, { status: 400 });
    }

    await prisma.magazineIssue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting magazine issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete magazine issue' },
      { status: 500 }
    );
  }
}

