import { FEATURES } from '@/src/constants/features';
import product from '@/src/controllers/product';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.get(auth.canRequest(FEATURES.READ_PRODUCT), product.getByIdHandler);
router.patch(auth.canRequest(FEATURES.UPDATE_PRODUCT), product.patchHandler);
router.delete(
  auth.canRequest(FEATURES.DELETE_PRODUCT),
  product.deleteHandler,
);

export default router.handler(controller.errorHandlers);
