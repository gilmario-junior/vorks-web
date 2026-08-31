import DefaultLayout from '@/src/components/DefaultLayout';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';

export default function Orders({ user }: { user: User }) {
  return (
    <DefaultLayout title='Pedidos' user={user}>
      <></>
    </DefaultLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
