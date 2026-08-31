import userModel from '@/src/models/user';
import { NotFoundError, ValidationError } from '../infra/errors';
import password from './password';
import { FEATURES } from '@/src/constants/features';
import { User } from '@/src/types/user';

async function create(user: any) {
  await validateEmail(user.email);
  await hashPassword(user.password);
  await injectDefaultFeatures();
  const createdUser = await userModel.create(user);
  return createdUser;

  async function injectDefaultFeatures() {
    user.features = [
      FEATURES.CREATE_SESSION,
      FEATURES.READ_SESSION,
      FEATURES.UPDATE_USER,
      FEATURES.READ_STORE,
      FEATURES.CREATE_PRODUCT,
      FEATURES.READ_PRODUCT,
      FEATURES.UPDATE_PRODUCT,
      FEATURES.DELETE_PRODUCT,
    ];
  }
  async function hashPassword(passwordReceived: string) {
    user.password = await password.hash(passwordReceived);
  }
}

async function validateEmail(email: string) {
  const emailExist = await userModel.findByEmail(email);
  if (emailExist) {
    throw new ValidationError({
      message: 'O email informado já está sendo utilizado',
      action: 'Utilizar um email diferente para esta ação!',
    });
  }
}

async function setFeatures(userId: string, features: string[]) {
  const updatedUser = await userModel.updateFeatures(userId, features);
  return updatedUser;
}

async function getUserById(userId: string) {
  const user = await userModel.findOneById(userId);
  return user;
}

async function getUserByQuery(
  param: 'fullName' | 'email',
  data: string,
  user: User,
) {
  const column: Record<'fullName' | 'email', string> = {
    fullName: 'full_name',
    email: 'email',
  };
  const searchValue = data.trim() ? `%${data.trim()}%` : '';
  const usersFounded = await userModel.find(
    column[param],
    [searchValue],
    user.storeId,
  );
  return usersFounded;
}

async function updateUserById(id: string, params: User) {
  const existingUser = await userModel.findOneById(id);
  if (!existingUser)
    throw new NotFoundError({
      message: 'Usuário não encontrado',
      action: 'Informe um usuário válido',
    });
  if (params.email !== existingUser.email)
    await validateEmail(existingUser.email);
  const foundedUser = await userModel.updateUserById(id, params);
  return foundedUser;
}

const user = {
  create,
  getUserById,
  getUserByQuery,
  updateUserById,
};

export default user;
