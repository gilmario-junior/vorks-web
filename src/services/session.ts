import { ForbiddenError, UnauthorizedError } from '@/src/infra/errors';
import sessionModel from '@/src/models/session';
import authentication from '@/src/services/authentication';
import { User, UserRecord } from '@/src/types/user';
import authorization from '@/src/services/authorization';
import { FEATURES } from '@/src/constants/features';
import { Session } from '@/src/types/session';

async function create(userValues: UserRecord) {
  const authenticatedUser = await authentication.validate(
    userValues.email,
    userValues.password,
  );
  if (!authorization.can(authenticatedUser, FEATURES.CREATE_SESSION)) {
    throw new ForbiddenError({});
  }

  const sessionCreated = await sessionModel.create(
    String(authenticatedUser.id),
  );
  return { authenticatedUser, sessionCreated };
}

async function getSessionVaidByToken(token: string) {
  const session = await sessionModel.findOneValidByToken(token);
  if (!session?.id) {
    throw new UnauthorizedError({
      message: 'Sessão inválida ou expirada.',
      action: 'Faça login novamente.',
    });
  }
  const transformedSession = {
    id: session.id,
    token: session.token,
    userId: session.user_id,
    features: session.features,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    expiresAt: session.expires_at,
  };
  return transformedSession;
}

const expirationInMilliseconds = 60 * 60 * 24 * 1000;

const session = {
  create,
  getSessionVaidByToken,
  expirationInMilliseconds,
};

export default session;
