import { getUserSession } from '@/lib/auth';
import ProfileForm from './ProfileForm';
import prisma from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getUserSession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>My Profile</h1>
      <div className="card">
        <div className="card-body">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
