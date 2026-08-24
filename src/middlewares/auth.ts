import { ForbiddenError, UnauthorizedError } from '../infra/errors';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import authorization from '../services/authorization';
import { Feature } from '@/src/constants/features';
import session from '@/src/models/session';
import user from '@/src/models/user';

async function injectAnonymousOrUser(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
) {
  if (request.cookies?.session_id) {
    try {
      await injectAuthenticatedUser(request);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        await injectAnonymousUser(request);
      } else {
        throw error;
      }
    }
  } else {
    await injectAnonymousUser(request);
  }
  return next();
}

function canRequest(feature: Feature) {
  return function canRequestMiddleware(
    request: NextApiRequest,
    response: NextApiResponse,
    next: NextHandler,
  ) {
    const userTryingRequest = request.context.user;
    if (authorization.can(userTryingRequest, feature)) {
      return next();
    }
    throw new ForbiddenError({});
  };
}

async function injectAuthenticatedUser(request: NextApiRequest) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findOneValidByToken(String(sessionToken));
  const userObject = await user.findOneById(sessionObject.user_id);
  request.context = { ...request.context, user: userObject };
}

async function injectAnonymousUser(request: NextApiRequest) {
  const anonymousUserObject = {
    features: ['create:session', 'create:store'],
  };
  request.context = { ...request.context, user: anonymousUserObject };
}

const auth = {
  injectAnonymousOrUser,
  canRequest,
};

export default auth;
