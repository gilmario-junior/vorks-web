import productModel from '@/src/models/product';
import { ForbiddenError, NotFoundError } from '@/src/infra/errors';
import { User } from '@/src/types/user';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/src/types/product';

async function create(user: User, input: CreateProductInput) {
  const productCreated = await productModel.create({
    storeId: user.storeId,
    name: input.name,
    description: input.description ?? null,
    priceInCents: input.priceInCents,
    stockQuantity: input.stockQuantity ?? 0,
    images: input.images ?? [],
  });
  return productCreated;
}

async function listByStore(user: User) {
  const products = await productModel.findByStoreId(user.storeId);
  return products;
}

async function getById(user: User, productId: string) {
  const productFounded = await findOwnedProduct(user, productId);
  return productFounded;
}

async function update(user: User, productId: string, input: UpdateProductInput) {
  await findOwnedProduct(user, productId);
  const productUpdated = await productModel.update(productId, input);
  return productUpdated;
}

async function remove(user: User, productId: string) {
  await findOwnedProduct(user, productId);
  await productModel.remove(productId);
}

async function findOwnedProduct(user: User, productId: string) {
  const productFounded = await productModel.findById(productId);
  if (!productFounded) {
    throw new NotFoundError({
      message: 'O produto informado não foi encontrado no sistema.',
      action: 'Verifique se o id do produto está correto.',
    });
  }
  validateOwnership(user, productFounded);
  return productFounded;
}

function validateOwnership(user: User, product: Product) {
  if (product.storeId !== user.storeId) {
    throw new ForbiddenError({
      message: 'Você não tem permissão para acessar este produto.',
      action: 'Verifique se o produto pertence à sua loja.',
    });
  }
}

const product = {
  create,
  listByStore,
  getById,
  update,
  remove,
};

export default product;
