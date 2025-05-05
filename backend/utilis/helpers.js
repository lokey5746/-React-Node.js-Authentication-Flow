import bcrypt from "bcryptjs";

// hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateVerificationToken = async () => {
  return await Math.floor(100000 + Math.random() * 900000).toString();
};

export { hashPassword, verifyPassword, generateVerificationToken };
