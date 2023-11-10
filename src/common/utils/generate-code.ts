export const generateCode = (length: number) => {
  let code = '';
  const chars = '0123456789';

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return Number(code);
};
