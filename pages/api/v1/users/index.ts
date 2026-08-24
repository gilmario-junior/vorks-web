import user from '@/src/controllers/user';
import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(auth.injectAnonymousOrUser);
router.post(user.postHandler);
router.get(user.getHandler);

export default router.handler(controller.errorHandlers);
