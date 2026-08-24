// src/types/feature.ts
import type { User } from './user';
import type { Session, SessionRecord } from './session';
import type { UserActivationToken } from './user';
import type { StatusData } from './status';

export interface FeatureMap {
  'read:user': { target: User; return: Partial<User> | undefined };
  'read:session': {
    target: SessionRecord;
    return: Partial<Session> | undefined;
  };
  'read:status': { target: StatusData; return: Partial<StatusData> };
  'read:status:admin': { target: StatusData; return: Partial<StatusData> };
}
