import { NextApiRequest, NextApiResponse } from 'next';
import sessionService from '@/src/services/session';
import controller from '../infra/controller';
import authorization from '@/src/services/authorization';

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { authenticatedUser, sessionCreated } = await sessionService.create(
    req.body,
  );

  await controller.setSessionCookie(sessionCreated.token, res);

  const secureValues = authorization.filterOutput(
    authenticatedUser,
    'read:session',
    sessionCreated,
  );
  res.status(201).json(secureValues);
}

const session = {
  postHandler,
};

export default session;
