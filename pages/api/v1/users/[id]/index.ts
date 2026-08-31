import { FEATURES } from '@/src/constants/features';
import user from '@/src/controllers/user';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { createRouter } from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next/types';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.patch(auth.canRequest(FEATURES.UPDATE_USER), user.patchHandler);

export default router.handler(controller.errorHandlers);
