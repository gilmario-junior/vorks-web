import DefaultLayout from '@/src/components/DefaultLayout';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';

export default function HomePage({ user }: { user: User }) {
  return (
    <DefaultLayout user={user}>
      <div className='w-full shadow-sm'>
        <h1 className='text-5xl font-black text-center'>Vorks Store</h1>
      </div>
      <div className='text-right'></div>
    </DefaultLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
