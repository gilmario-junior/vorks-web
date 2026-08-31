import Header from '@/src/components/DefaultLayout/header';
import { User } from '@/src/types/user';

export default function DefaultLayout({
  user,
  title,
  children,
}: {
  user: User;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header user={user} />
      <main>
        <h1 className='text-4xl text-blue-900 text-center font-bold'>
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
