import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function PUT(request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const mobile = String(formData.get('mobile') || '').trim();
    const password = String(formData.get('password') || '');
    const photo = formData.get('photo');

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;

    if (email || mobile) {
      const existing = await prisma.user.findFirst({
        where: {
          id: { not: session.userId },
          OR: [
            email ? { email } : undefined,
            mobile ? { mobile } : undefined,
          ].filter(Boolean),
        },
      });

      if (existing) {
        return NextResponse.json({ error: 'Email or mobile already in use' }, { status: 400 });
      }
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (photo && photo instanceof File) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      updateData.photoUrl = `/uploads/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { name: updatedUser.name, email: updatedUser.email } });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
