import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
import { compare, genSaltSync, hash } from "bcrypt";
import jwt from "jsonwebtoken";

//Armazena as variaveis de ambiente em um objeto
export const envs = {
  JWT_SECRET: process.env.JWT_SECRET || "secret123",
  PORT: process.env.PORT || 3000,
};

//Declara o prisma em uma variavel
export const prisma = new PrismaClient();

//Utilitario resposavel pela codificação da senha do usuario para armazenamento, assim protegendo a senha
//dos usuarios no banco
export const hashPassword = (password) => {
  let salt = genSaltSync(10);
  return new Promise((res) => {
    hash(password, salt, (err, saltedPassword) => {
      res(saltedPassword);
    });
  });
};

//Utilitario responsavel por receber uma senha e comoparar com alguma determinada senha do banco
//para validações de login.
export const comparePassword = (password, hashedPassword) => {
  return new Promise((res) => {
    compare(password, hashedPassword, (err, same) => {
      if (err) res(false);
      else res(same);
    });
  });
};

//Utilitario responsavel pela criação do token de acesso (Barear token)
export const createAccessToken = (data) => {
  return new Promise((res, rej) => {
    jwt.sign(data, envs.JWT_SECRET, {}, (err, token) => {
      if (err) rej(err);
      res(token);
    });
  });
};

//Verifica se um token é valido ou não
export const verifyToken = (token) => {
  return new Promise((res, rej) => {
    if (!token) {
      rej("invalid token");
      return;
    }

    jwt.verify(token, envs.JWT_SECRET, {}, (err, decoded) => {
      if (err) {
        rej("invalid token");
        return;
      }
      res(decoded);
    });
  });
};
