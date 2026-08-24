import Link from 'next/link';
import { useState } from 'react';
import type { UserFull } from '@/src/types/user';

interface HeaderProps {
  user: UserFull;
}

const navLinks = [
  { label: 'Pedidos', href: '/orders' },
  { label: 'Estoque', href: '/products' },
  { label: 'Configurações', href: '/configs' },
];

export default function Header({ user }: HeaderProps) {
  const [loggingOut, setLoggingOut] = useState(false);

  function firstName(fullName: string) {
    return fullName.trim().split(' ')[0];
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/v1/sessions', { method: 'DELETE' });
    window.location.href = '/login';
  }

  return (
    <header className='bg-slate-900'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <svg
            className='h-6 w-6 text-blue-500'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M4 12c2-4 6-4 8 0s6 4 8 0'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          </svg>
          <span className='text-lg font-bold text-white'>Vorks</span>
        </Link>

        {/* Menu central */}
        <div className='hidden items-center gap-8 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-slate-300 transition hover:text-white'
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='hidden items-center gap-3 sm:flex'>
          <span className='text-sm text-slate-300'>
            {firstName(user.fullName)}
          </span>
          <span className='rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400'>
            {user.storeName}
          </span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className='flex items-center gap-1 text-sm font-medium text-white transition hover:text-blue-400 disabled:opacity-50'
          >
            {loggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </nav>
    </header>
  );
}
