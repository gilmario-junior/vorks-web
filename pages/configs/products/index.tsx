import MenuLayout from '@/src/components/MenuLayout/menu';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';

export default function ConfigProducts({ user }: { user: User }) {
  return (
    <MenuLayout title='Produtos' user={user}>
      <></>
    </MenuLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
