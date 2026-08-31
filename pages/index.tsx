import DefaultLayout from '@/src/components/DefaultLayout';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';

export default function HomePage({ user }: { user: User }) {
  return (
    <DefaultLayout title='Vorks' user={user}>
      <div className='text-right'></div>
    </DefaultLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
