import DefaultLayout from '@/src/components/DefaultLayout';
import { User } from '@/src/types/user';
import Link from 'next/link';

export default function MenuLayout({
  title,
  user,
  children,
}: {
  title?: string;
  user: User;
  children: React.ReactNode;
}) {
  const menuItems = [
    { label: 'Usuário', href: '/configs/users' },
    { label: 'Produtos', href: '/configs/products' },
  ];
  return (
    <DefaultLayout user={user}>
      <div className='flex gap-8 min-h-screen'>
        <nav className='w-48 shrink-0 items-center text-center bg-gray-600 min-h-full pt-12'>
          {menuItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className='block rounded-md px-3 py-2 text-sm font-semibold text-gray-100 transition hover:bg-gray-100 hover:text-gray-800'
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <section className='flex-1 text-center'>
          <div className='text-4xl text-blue-900 text-center font-bold'>
            {title}
          </div>
          <hr className='w-full -ml-8 border-gray-300' />
          <div className='pt-2'>{children}</div>
        </section>
      </div>
    </DefaultLayout>
  );
}
