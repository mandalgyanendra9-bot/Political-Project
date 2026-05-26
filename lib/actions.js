'use server';

import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// Helper to check admin
async function requireAdmin() {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

// News Actions
export async function createNews(formData) {
  await requireAdmin();
  
  const title = String(formData.get('title') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const type = String(formData.get('type') || 'NEWS').trim();
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null;
  const videoUrl = String(formData.get('videoUrl') || '').trim() || null;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }
  
  await prisma.news.create({
    data: { title, content, type, imageUrl, videoUrl }
  });
  
  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
}

export async function deleteNews(id) {
  await requireAdmin();
  await prisma.news.delete({ where: { id } });
  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
}

// Event Actions
export async function createEvent(formData) {
  await requireAdmin();
  
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const dateString = String(formData.get('date') || '').trim();
  const date = new Date(dateString);
  const location = String(formData.get('location') || '').trim();
  const registrationUrl = String(formData.get('registrationUrl') || '').trim() || null;
  const isOnline = formData.get('isOnline') === 'on';

  if (!title || !description || !dateString || !location) {
    throw new Error('All event fields are required');
  }
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid event date');
  }
  
  await prisma.event.create({
    data: { title, description, date, location, isOnline, registrationUrl }
  });
  
  revalidatePath('/admin/events');
  revalidatePath('/events');
}

export async function deleteEvent(id) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath('/admin/events');
  revalidatePath('/events');
}

export async function updateMemberStatus(formData) {
  await requireAdmin();

  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');

  if (!id || !['ACTIVE', 'PENDING'].includes(status)) {
    throw new Error('Invalid member update payload');
  }

  await prisma.user.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/members');
  revalidatePath('/dashboard');
}
