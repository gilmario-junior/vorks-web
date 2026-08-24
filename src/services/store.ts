import { ValidationError } from '@/src/infra/errors';
import { Store } from '@/src/types/store';
import storeModel from '@/src/models/store';
import database from '@/src/infra/database';
import authorization from '@/src/services/authorization';
import { User } from '@/src/types/user';
import { FEATURES } from '@/src/constants/features';

async function create(storeName: string) {
  await validateStoreName(storeName);
  const result: Store = await storeModel.create(storeName);
  return result;

  async function validateStoreName(storeName: string) {
    const result = await storeModel.findByStoreName(storeName);
    if (result) {
      throw new ValidationError({
        action: 'Verifique se o cadastro está sendo duplicado.',
        message: 'O nome informado já está sendo utilizado',
      });
    }
  }
}
async function getStoreById(storeId: string) {
  const result = await storeModel.findByStoreId(storeId);
  return result;
}

async function searchStores(requesterUser: User, storeName?: string) {
  const isAdmin = authorization.can(requesterUser, FEATURES.READ_STORE_ADMIN);

  if (!isAdmin) {
    const ownStore = await storeModel.findByStoreId(requesterUser.storeId);
    return ownStore ? [ownStore] : [];
  }

  if (storeName) {
    const storeFounded = await storeModel.findByStoreName(storeName);
    return storeFounded ? [storeFounded] : [];
  } else {
    const stores = await storeModel.find();
    return stores ? stores : [];
  }
}

const store = {
  create,
  getStoreById,
  searchStores,
};

export default store;
