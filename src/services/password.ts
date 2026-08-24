import bcryptjs from 'bcryptjs';

async function hash(password: string) {
  const rounds = await getNumbersOfRounds();
  return await bcryptjs.hash(password, rounds);
}

async function getNumbersOfRounds() {
  return process.env.NODE_ENV === 'production' ? 14 : 4;
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
