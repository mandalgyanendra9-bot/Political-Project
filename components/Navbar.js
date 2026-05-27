import { getUserSession } from '@/lib/auth';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const session = await getUserSession();
  const role = session?.role || null;

  return <NavbarClient role={role} />;
}
