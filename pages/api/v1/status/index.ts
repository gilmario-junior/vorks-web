import controller from '@/src/infra/controller';
import auth from '@/src/middlewares/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(auth.injectAnonymousOrUser, getHandler);

export default router.handler(controller.errorHandlers);

function getHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Iniciado com sucesso' });
}
