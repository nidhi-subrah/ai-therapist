import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/signin');
  }
  
  // At this point, we know session.user exists
  return session;
}

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}
