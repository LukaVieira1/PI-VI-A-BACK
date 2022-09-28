import { verifyToken } from "../helpers/utils.js";

//Middleware que valida se a pessoa esta logada (via token) para permitir, ou nao, uma request
//Em caso de uso a mesma devera ser chamada em um pre-handler nas rotas

export const validateRequest = async (req, res) => {
  try {
    const auth = req.headers["authorization"];
    const token = auth?.replace("Bearer ", "");

    const user = await verifyToken(token);
    req.user = user;
  } catch (error) {
    return res.status(401).send({ error: "Unauthorized!" });
  }
};
