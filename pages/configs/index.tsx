import { User } from '@/src/types/user';
import { requireAuth } from '@/src/infra/requireAuth';
import MenuLayout from '@/src/components/MenuLayout/menu';

export default function ConfigPage({ user }: { user: User }) {
  return (
    <MenuLayout title='Configurações' user={user}>
      <p className='text-sm pt-4 text-gray-500'>
        Selecione uma opção no menu ao lado.
      </p>
    </MenuLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
