import User from '@/src/types/user';

declare module 'next' {
  interface NextApiRequest {
    cookies;
    context: {
      user: User;
      tenantId?: string;
    };
  }
}
