export const FEATURES = {
  //STORE
  CREATE_STORE_ADMIN: 'create:store:admin',
  CREATE_STORE: 'create:store',
  READ_STORE_ADMIN: 'read:store:admin',
  READ_STORE: 'read:store',

  // USER
  READ_USER: 'read:user',
  CREATE_USER: 'create:user',
  UPDATE_USER: 'update:user',
  UPDATE_USER_OTHER: 'update:user:other',

  // SESSION
  READ_SESSION: 'read:session',
  CREATE_SESSION: 'create:session',

  // STATUS
  READ_STATUS: 'read:status',
  READ_STATUS_ADMIN: 'read:status:admin',

  // PRODUCT
  CREATE_PRODUCT: 'create:product',
  READ_PRODUCT: 'read:product',
  UPDATE_PRODUCT: 'update:product',
  DELETE_PRODUCT: 'delete:product',
} as const;

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];
export const featureValues: Feature[] = Object.values(FEATURES);
