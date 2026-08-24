import { NextApiRequest, NextApiResponse } from 'next';
import productService from '@/src/services/product';

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const productValues = req.body;
  const user = req.context.user;
  const productCreated = await productService.create(user, productValues);
  res.status(201).json(productCreated);
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.context.user;
  const products = await productService.listByStore(user);
  res.status(200).json(products);
}

async function getByIdHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const user = req.context.user;
  const productFounded = await productService.getById(user, id as string);
  res.status(200).json(productFounded);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const user = req.context.user;
  const productUpdated = await productService.update(
    user,
    id as string,
    req.body,
  );
  res.status(200).json(productUpdated);
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const user = req.context.user;
  await productService.remove(user, id as string);
  res.status(204).end();
}

const product = {
  postHandler,
  getHandler,
  getByIdHandler,
  patchHandler,
  deleteHandler,
};

export default product;
