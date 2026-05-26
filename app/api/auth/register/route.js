import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

const MOBILE_REGEX = /^[0-9]{10}$/;

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const mobile = String(formData.get('mobile') || '').trim();
    const password = String(formData.get('password') || '');
    const photo = formData.get('photo');

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!MOBILE_REGEX.test(String(mobile))) {
      return NextResponse.json({ error: 'Mobile number must be 10 digits' }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email or mobile already exists' }, { status: 400 });
    }

    let photoUrl = null;

    if (photo && photo instanceof File) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        photoUrl
      }
    });

    return NextResponse.json({ success: true, userId: user.id });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Something went wrong during registration' }, { status: 500 });
  }
}
