import { getUserSession } from '@/lib/auth';
import IdCardClient from './IdCardClient';
import prisma from '@/lib/prisma';

export default async function IdCardPage() {
  const session = await getUserSession();
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '8px' }}>Digital ID Card</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        This is your official party membership card. You can download it and keep it on your phone.
      </p>
      
      <IdCardClient user={user} />
    </div>
  );
}
