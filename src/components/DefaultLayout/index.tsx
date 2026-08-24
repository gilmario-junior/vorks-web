import Header from '@/src/components/DefaultLayout/header';
import { User } from '@/src/types/user';

export default function DefaultLayout({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header user={user} />
      <main>{children}</main>
    </div>
  );
}
