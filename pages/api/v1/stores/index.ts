import { FEATURES } from '@/src/constants/features';
import store from '@/src/controllers/store';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.post(auth.canRequest(FEATURES.CREATE_STORE), store.postHandler);
router.get(auth.canRequest(FEATURES.READ_STORE), store.getHandler);

export default router.handler(controller.errorHandlers);
