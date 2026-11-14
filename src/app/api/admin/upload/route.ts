import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = (formData.get('type') as string) || 'file';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (type === 'cover') {
      if (!ALLOWED_IMAGE_TYPES.has(file.type) && !file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Please upload an image (JPG, PNG, WebP).' },
          { status: 400 }
        );
      }
    } else if (type === 'pdf') {
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        return NextResponse.json(
          { error: 'Invalid file type. Please upload a PDF file.' },
          { status: 400 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name).toLowerCase() || (type === 'pdf' ? '.pdf' : '.jpg');
    const baseName = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || type;

    const uniqueFilename = `${type}-${Date.now()}-${baseName}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'issues');

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const url = `/api/uploads/issues/${uniqueFilename}`;

    return NextResponse.json({
      url,
      filename: file.name,
      storedFilename: uniqueFilename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error uploading magazine file:', error);
    return NextResponse.json(
      { error: 'Failed to store uploaded file on server' },
      { status: 500 }
    );
  }
}
