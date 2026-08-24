import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { parseCookie } from 'cookie';
import sessionService from '@/src/services/session';
import type { UserFull } from '@/src/types/user';
import userService from '@/src/services/user';
import storeService from '@/src/services/store';

export function requireAuth<
  P extends Record<string, any> = Record<string, never>,
>(
  gssp?: (
    context: GetServerSidePropsContext,
    user: UserFull,
  ) => Promise<{ props: P }>,
): GetServerSideProps {
  return async (context) => {
    try {
      const cookies = parseCookie(context.req.headers.cookie || '');
      const sessionToken = cookies.session_id;

      if (!sessionToken) {
        return { redirect: { destination: '/login', permanent: false } };
      }

      const session = await sessionService.getSessionVaidByToken(sessionToken);

      if (!session) {
        return { redirect: { destination: '/login', permanent: false } };
      }

      const user = await userService.getUserById(session.userId);

      if (!user) {
        return { redirect: { destination: '/login', permanent: false } };
      }

      const store = await storeService.getStoreById(user.storeId);
      const userFull: UserFull = { ...user, storeName: store?.storeName };

      if (gssp) {
        return gssp(context, userFull);
      }

      return { props: {} as P };
    } catch (error) {
      return { redirect: { destination: '/login', permanent: false } };
    }
  };
}
