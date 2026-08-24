import { FEATURES } from '@/src/constants/features';
import store from '@/src/controllers/store';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next/types';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.get(auth.canRequest(FEATURES.READ_STORE), store.getByIdHandler);

export default router.handler(controller.errorHandlers);
