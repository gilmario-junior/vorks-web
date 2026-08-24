import { InternalServerError } from '@/src/infra/errors';
import { User } from '@/src/types/user';
import { StatusData } from '@/src/types/status';
import { Session } from '@/src/types/session';
import { FeatureMap } from '@/src/types/feature';
import { Feature, featureValues } from '@/src/constants/features';

function can(user: User, feature: Feature, target?: any) {
  validateUser(user);
  validateFeatures(feature);

  let authorized = false;

  if (user.features?.includes(feature)) {
    authorized = true;
  }

  if (feature === 'update:user' && target) {
    authorized = false;
    if (user.id == target.id || can(user, 'update:user:other')) {
      authorized = true;
    }
  }
  return authorized;
}

export function filterOutput<F extends keyof FeatureMap>(
  user: User,
  feature: F,
  target: FeatureMap[F]['target'],
): FeatureMap[F]['return'] {
  validateUser(user);
  validateFeatures(feature);
  validateTarget(target);

  const filter = filters[feature];

  if (!filter) {
    throw new Error(`Feature ${feature} não suportada.`);
  }

  return filter(user, target);
}

type FilterStrategy<F extends keyof FeatureMap> = (
  user: User,
  target: FeatureMap[F]['target'],
) => FeatureMap[F]['return'];

function filterStatus(user: User, target: StatusData): Partial<StatusData> {
  const result: any = {
    updated_at: target.updatedAt,
    database: {
      max_connections: target.database.maxConnections,
      active_users: target.database.activeUsers,
    },
  };

  if (user.features?.includes('read:status:admin')) {
    result.database.version = target.database.version;
  }

  return result;
}

const filters: { [F in keyof FeatureMap]: FilterStrategy<F> } = {
  'read:user': (_, target) => ({
    id: target.id,
    fullName: target.fullName,
    features: target.features,
    storeId: target.storeId,
    createdAt: target.createdAt,
    updatedAt: target.updatedAt,
  }),

  'read:session': (user, target) => {
    if (target.user_id !== user.id) return undefined;
    return {
      id: target.id,
      token: target.token,
      userId: target.user_id,
      features: user.features,
      createdAt: target.created_at,
      updatedAt: target.updated_at,
      expiresAt: target.expires_at,
    };
  },

  'read:status': (user, target) => filterStatus(user, target),
  'read:status:admin': (user, target) => filterStatus(user, target),
};

function validateUser(user: User) {
  if (!user || !user.features) {
    throw new InternalServerError({
      cause: 'User or user.features is required',
    });
  }
}

function validateFeatures(features: Feature) {
  if (!features || !featureValues.includes(features)) {
    throw new InternalServerError({
      cause: 'It is necessary to inform a valid feature',
    });
  }
}

function validateTarget(target?: any) {
  if (!target) {
    throw new InternalServerError({
      cause: 'It is necessary to inform a Target',
    });
  }
}

const authorization = {
  can,
  filterOutput,
};

export default authorization;
