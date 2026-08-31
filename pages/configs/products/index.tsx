import { useState, useEffect, SubmitEvent } from 'react';
import MenuLayout from '@/src/components/MenuLayout/menu';
import { Button } from '@/src/components/forms/Button';
import { Modal } from '@/src/components/forms/Modal';
import { requireAuth } from '@/src/infra/requireAuth';
import { uploadProductImage, InvalidImageError } from '@/src/infra/supabase';
import type { User } from '@/src/types/user';
import type { Product } from '@/src/types/product';

interface ApiError {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

export default function ConfigProducts({ user }: { user: User }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal de criar/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Campos do form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // exibido em reais, ex: "49,90"
  const [stockQuantity, setStockQuantity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal de confirmação de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/v1/products');
      if (response.ok) {
        setProducts(await response.json());
      }
    } finally {
      setLoadingProducts(false);
    }
  }

  function resetForm() {
    setName('');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setImages([]);
    setError(null);
    setEditingProductId(null);
  }

  function handleOpenCreateModal() {
    resetForm();
    setModalOpen(true);
  }

  function handleOpenEditModal(product: Product) {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice((product.priceInCents / 100).toFixed(2).replace('.', ','));
    setStockQuantity(String(product.stockQuantity));
    setImages(product.images ?? []);
    setError(null);
    setModalOpen(true);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImages((prev) => [...prev, url]);
    } catch (err) {
      if (err instanceof InvalidImageError) {
        setError({
          name: 'InvalidImageError',
          message: err.message,
          action: 'Escolha outra imagem e tente novamente.',
          status_code: 400,
        });
      } else {
        setError({
          name: 'UploadError',
          message: 'Não foi possível enviar a imagem.',
          action: 'Tente novamente em instantes.',
          status_code: 500,
        });
      }
    } finally {
      setUploading(false);
      // permite selecionar o mesmo arquivo de novo, se precisar
      e.target.value = '';
    }
  }

  function handleRemoveImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function parsePriceToCents(value: string): number {
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const isEditing = Boolean(editingProductId);
    const url = isEditing
      ? `/api/v1/products/${editingProductId}`
      : '/api/v1/products';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          priceInCents: parsePriceToCents(price),
          stockQuantity: Number(stockQuantity),
          images,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body as ApiError);
        return;
      }

      setModalOpen(false);
      resetForm();
      await fetchProducts();
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

  function handleOpenDeleteModal(product: Product) {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        setDeleteModalOpen(false);
        setProductToDelete(null);
        await fetchProducts();
      }
    } finally {
      setDeleting(false);
    }
  }

  function formatPrice(priceInCents: number): string {
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  }

  return (
    <MenuLayout title='Produtos' user={user}>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-900'>Produtos</h1>
        <Button
          buttonText='Criar produto'
          onClick={handleOpenCreateModal}
          type='button'
        />
      </div>

      <div className='mt-4 overflow-hidden rounded-lg border border-gray-200'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Imagem
              </th>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Nome
              </th>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Preço
              </th>
              <th className='px-4 py-3 text-sm font-medium text-gray-700'>
                Estoque
              </th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {loadingProducts ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-6 text-center text-sm text-gray-500'
                >
                  Carregando produtos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-6 text-center text-sm text-gray-500'
                >
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-3'>
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        className='h-10 w-10 rounded object-cover'
                        alt={p.name}
                      />
                    ) : (
                      <div className='h-10 w-10 rounded bg-gray-100' />
                    )}
                  </td>
                  <td className='px-4 py-3 text-sm font-medium text-gray-900'>
                    {p.name}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500'>
                    {formatPrice(p.priceInCents)}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500'>
                    {p.stockQuantity}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex justify-end gap-3'>
                      <Button
                        buttonText='Editar'
                        variant='linkPrimary'
                        onClick={() => handleOpenEditModal(p)}
                      />
                      <Button
                        buttonText='Excluir'
                        variant='linkDanger'
                        onClick={() => {
                          handleOpenDeleteModal(p);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de criar/editar produto */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingProductId ? 'Editar produto' : 'Cadastrar produto'}
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

          <div className='mb-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Nome
            </label>
            <input
              type='text'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          <div className='mb-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              rows={3}
            />
          </div>

          <div className='mb-4 flex gap-4'>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Preço (R$)
              </label>
              <input
                type='text'
                required
                placeholder='0,00'
                disabled={Boolean(editingProductId)}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <div className='flex-1'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Estoque
              </label>
              <input
                type='number'
                required
                min='0'
                disabled={Boolean(editingProductId)}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='mb-6'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Imagens
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              disabled={uploading}
            />

            {uploading && (
              <p className='mt-1 text-xs text-gray-500'>Enviando imagem...</p>
            )}

            <div className='mt-2 flex flex-wrap gap-2'>
              {images.map((url) => (
                <div key={url} className='relative'>
                  <img
                    src={url}
                    className='h-16 w-16 rounded object-cover'
                    alt='Imagem do produto'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(url)}
                    className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type='submit'
            buttonText={
              editingProductId ? 'Salvar alterações' : 'Criar produto'
            }
            loading={loading}
            loadingText={editingProductId ? 'Salvando...' : 'Criando...'}
          />
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title='Excluir produto'
      >
        <p className='mb-6 text-sm text-gray-700'>
          Tem certeza que deseja excluir{' '}
          <strong>{productToDelete?.name}</strong>? Essa ação não pode ser
          desfeita.
        </p>
        <div className='flex justify-end gap-3'>
          <Button
            type='button'
            buttonText='Cancelar'
            variant='ghost'
            onClick={() => {
              setDeleteModalOpen(false);
              setProductToDelete(null);
            }}
          />
          <Button
            type='button'
            buttonText='Excluir'
            variant='danger'
            loading={deleting}
            loadingText='Excluindo...'
            onClick={handleConfirmDelete}
          />
        </div>
      </Modal>
    </MenuLayout>
  );
}

export const getServerSideProps = requireAuth(async (context, user) => {
  return { props: { user } };
});
