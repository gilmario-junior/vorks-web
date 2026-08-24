import controller from '@/src/infra/controller';
import session from '@/src/controllers/session';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequest } from 'next/types';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(session.postHandler);

export default router.handler(controller.errorHandlers);
