import { useState, SubmitEvent } from 'react';
import { requireAuth } from '@/src/infra/requireAuth';
import { User } from '@/src/types/user';
import MenuLayout from '@/src/components/MenuLayout/menu';
import { Button } from '@/src/components/forms/Button';
import { Modal } from '@/src/components/forms/Modal';
import { Store } from '@/src/types/store';

interface ApiError {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export default function ConfigUsers({ user }: { user: User }) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStoreOpen, setModalStoreOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idUserEditing, setIdUserEditing] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState('fullName');
  const [stores, setStores] = useState([]);
  const [storeLocked, setStoreLocked] = useState(false);

  async function fetchUsers() {
    const response = await fetch(
      `/api/v1/users?search=${encodeURIComponent(search)}&by=${searchBy}`,
    );
    if (response.ok) {
      const bodyJson = await response.json();
      setUsers(bodyJson);
    }
    if (response.status !== 200) {
      console.log('Erro', response.statusText);
      console.log('Erro', response.status);
    }
  }

  function resetForm() {
    setFullName('');
    setEmail('');
    setStoreName('');
    setPassword('');
    setError(null);
    setIsEditing(false);
  }

  function handleOpenModalCreateUser() {
    resetForm();
    setModalOpen(true);
  }

  async function handleOpenModalEdituser(user: User) {
    resetForm();
    setIsEditing(true);
    setEmail(user.email);
    setFullName(user.fullName);
    const response = await fetch(`/api/v1/stores/${user.storeId}`);
    const store = await response.json();
    setStoreName(store.storeName);
    setIdUserEditing(String(user.id));
    setModalOpen(true);
  }

  async function handleModalStoreOpen() {
    const response = await fetch('/api/v1/stores');
    const data = await response.json();
    setStores(data);
    setModalStoreOpen(true);
  }

  async function handleSelectStore(storeName: string, storeId: string) {
    setStoreName(storeName);
    setStoreId(storeId);
    setStoreLocked(true);
    setModalStoreOpen(false);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isEditing ? `/api/v1/users/${idUserEditing}` : '/api/v1/users';
    const method = isEditing ? 'PATCH' : 'POST';
    const bodyScreen = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(storeId && { storeId }),
      ...(password && { password }),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyScreen),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body as ApiError);
        return;
      }
      setModalOpen(false);
      resetForm();
      await setUsers(body);
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
    <MenuLayout title='Usuários' user={user}>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-xl font-semibold text-gray-900'>Buscar Usuários</h1>
        <Button
          buttonText='Criar Usuário'
          onClick={() => handleOpenModalCreateUser()}
          type='button'
        />
      </div>
      <div className='flex items-center justify-between'>
        <input
          type='text'
          placeholder='Buscar usuário...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />

        <label className='flex items-center text-sm text-gray-700'>
          <input
            type='radio'
            name='searchBy'
            value='fullName'
            checked={searchBy === 'fullName'}
            onChange={() => setSearchBy('fullName')}
          />
          Por Nome
        </label>

        <label className='flex items-center gap-1 text-sm text-gray-700'>
          <input
            type='radio'
            name='searchBy'
            value='email'
            checked={searchBy === 'email'}
            onChange={() => setSearchBy('email')}
          />
          Por Email
        </label>

        <Button
          type='button'
          buttonText='Buscar'
          variant='search'
          onClick={fetchUsers}
        />
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-200'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Nome Completo
              </th>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Email
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {users.map((u) => (
              <tr key={u.id} className='hover:bg-gray-50'>
                <td className='px-4 py-3 text-sm font-medium text-gray-900'>
                  {u.fullName}
                </td>
                <td className='px-4 py-3 text-sm text-gray-500'>{u.email}</td>
                <td className='px-4 py-3 text-sm text-gray-500'>
                  <Button
                    buttonText='Editar'
                    variant='linkPrimary'
                    onClick={() => handleOpenModalEdituser(u)}
                  />
                </td>
                <td className='px-4 py-3 text-sm text-gray-500'>
                  <Button buttonText='Excluir' variant='linkDanger' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Editando Usuário ' : 'Cadastrar novo usuário'}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3'>
              <p className='text-sm font-medium text-red-800'>
                {error.message}
              </p>
              <p className='text-sm text-red-600'>{error.action}</p>
            </div>
          )}

          <div className='mb-4 justify-between'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Nome completo
            </label>
            <input
              type='text'
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <div className='mb-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Loja
            </label>
            <div className='flex justify-between'>
              <input
                type='text'
                disabled
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={`${isEditing ? 'w-full' : 'w-2/3'} rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              <Button
                className={isEditing ? 'hidden' : ''}
                buttonText='Buscar'
                variant='search'
                onClick={handleModalStoreOpen}
              />
            </div>

            <Modal
              open={modalStoreOpen}
              onClose={() => setModalStoreOpen(false)}
              title='Loja'
            >
              <ul className='space-y-2'>
                {Array.isArray(stores) &&
                  stores.map((store: Store) => (
                    <li
                      key={store.id}
                      className='flex justify-between items-center p-2 border rounded'
                    >
                      <span>{store.storeName}</span>

                      <Button
                        buttonText='Selecionar'
                        variant='search'
                        onClick={() =>
                          handleSelectStore(store.storeName, store.id!)
                        }
                      />
                    </li>
                  ))}
              </ul>
            </Modal>
          </div>

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
            <label
              className='mb-1 block text-sm font-medium text-gray-700'
              hidden={isEditing}
            >
              Senha
            </label>
            <input
              type='password'
              required={!isEditing}
              hidden={isEditing}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <Button
            type='submit'
            buttonText={isEditing ? 'Editar Usuário' : 'Criar usuário'}
            loading={loading}
            loadingText='Criando...'
          />
        </form>
      </Modal>
    </MenuLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
