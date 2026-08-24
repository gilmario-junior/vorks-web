import { NextApiRequest, NextApiResponse } from 'next';
import storeService from '@/src/services/store';
import { Store } from '@/src/types/store';

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { storeName } = req.body;
  const storeCreated = await storeService.create(storeName);

  res.status(201).json(storeCreated);
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const storeName =
    typeof req.query.name === 'string' ? req.query.name : undefined;
  const result = await storeService.searchStores(req.context.user, storeName);
  return res.status(200).json(result);
}

async function getByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const store = storeService.getStoreById(id as string);
  return store;
}

const store = {
  postHandler,
  getHandler,
  getByIdHandler,
};

export default store;
