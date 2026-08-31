import DefaultLayout from '@/src/components/DefaultLayout';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';

export default function Products({ user }: { user: User }) {
  return (
    <DefaultLayout title='Estoque' user={user}>
      <h1 className='flex justify-center text-5xl text-blue-900'></h1>
    </DefaultLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
