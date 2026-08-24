import { NextApiRequest, NextApiResponse } from 'next';
import userService from '../services/user';

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const userValues = req.body;
  const userCreated = await userService.create(userValues);
  res.status(201).json(userCreated);
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { search } = req.query;
  const by: 'fullName' | 'email' = req.query.by as 'fullName' | 'email';
  const user = req.context.user;

  const usersFounded = await userService.getUserByQuery(
    by,
    String(search),
    user,
  );

  res.status(200).json(usersFounded);
}

const user = {
  postHandler,
  getHandler,
};

export default user;
