import { NotFoundError, UnauthorizedError } from '@/src/infra/errors';
import password from '@/src/services/password';
import user from '@/src/models/user';

async function validate(providedEmail: string, providedPassword: string) {
  try {
    const storedUser = await validateUser(providedEmail);
    await validatePassword(providedPassword, String(storedUser.password));
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: 'Dados de autenticaçào incorretos',
        action: 'Verifique se os dados enviados estão corretos',
      });
    }
    throw error;
  }

  async function validateUser(providedEmail: string) {
    const storedUser = await user.findByEmail(providedEmail);
    if (!storedUser) {
      throw new UnauthorizedError({
        message: 'Email não confere',
        action: 'Reenviar informação com dado correto.',
      });
    }
    return storedUser;
  }

  async function validatePassword(
    providedPassword: string,
    storedPassword: string,
  ) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );
    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: 'Senha não confere',
        action: 'Reenviar informação com dado correto.',
      });
    }
  }
}

const authentication = { validate };

export default authentication;
