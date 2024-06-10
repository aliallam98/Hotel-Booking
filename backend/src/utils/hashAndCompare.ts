import bcrypt from "bcryptjs";

export const hash = ({
  plaintext,
  salt = Number(process.env.SALT_ROUND!),
}: {
  plaintext: string;
  salt?: number;
}) => {
  const hashResult = bcrypt.hashSync(plaintext, Number(salt));
  return hashResult;
};

export const compare = ({
  plaintext,
  hashValue,
}: {
  plaintext: string;
  hashValue: string;
}) => {
  const match = bcrypt.compareSync(plaintext, hashValue);
  return match;
};
