import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/src/components/DefaultLayout';

interface ApiError {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/v1/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body as ApiError);
        return;
      }

      router.push('/');
    } catch {
      setError({
        name: 'NetworkError',
        message: 'Não foi possível conectar ao servidor.',
        action: 'Verifique sua conexão e tente novamente.',
        status_code: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='flex min-h-screen items-center justify-center bg-gray-200'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm'
        >
          <h1 className='mb-6 text-2xl font-semibold text-gray-900'>Entrar</h1>

          {error && (
            <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
              <p className='text-sm font-medium text-red-800'>
                {error.message}
              </p>
              <p className='text-sm text-red-600'>{error.action}</p>
            </div>
          )}

          <div className='mb-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <div className='mb-6'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Senha
            </label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* <p className='mt-4 text-center text-sm text-gray-600'>
          Não tem conta?{' '}
          <a
            href='/register'
            className='font-medium text-blue-600 hover:underline'
          >
            Criar conta
          </a>
        </p> */}
        </form>
      </div>
    </>
  );
}
