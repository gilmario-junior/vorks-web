import { NextApiRequest, NextApiResponse } from 'next';
import { stringifySetCookie } from 'cookie';
import {
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/src/infra/errors';
import session from '@/src/services/session';

function onNoMatchHandler(request: NextApiRequest, response: NextApiResponse) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function onErrorHandler(
  error: any,
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError
  ) {
    return response.status(error.statusCode).json(error);
  }
  const publicErrorObject = new InternalServerError({ cause: error });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
async function setSessionCookie(
  sessionToken: string,
  response: NextApiResponse,
) {
  const setCookie = stringifySetCookie({
    name: 'session_id',
    value: sessionToken,
    path: '/',
    maxAge: session.expirationInMilliseconds / 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });

  response.setHeader('Set-Cookie', setCookie);
}

async function clearSessionCookie(response: NextApiResponse) {
  const setCookie = stringifySetCookie({
    name: 'session_id',
    value: 'invalid',
    path: '/',
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });

  response.setHeader('Set-Cookie', setCookie);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
