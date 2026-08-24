import { FEATURES } from '@/src/constants/features';
import product from '@/src/controllers/product';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.post(auth.canRequest(FEATURES.CREATE_PRODUCT), product.postHandler);
router.get(auth.canRequest(FEATURES.READ_PRODUCT), product.getHandler);

export default router.handler(controller.errorHandlers);
