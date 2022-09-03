import { prisma } from "../helpers/utils.js";

export const index = async (req, res) => {
  try {
    let users = await prisma.pacient.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        gender: true,
        age: true,
        neighborhood: true,
        city: true,
        street: true,
        cellphone: true,
        cpf: true,
        schedules: true,
      },
    });
    return res.send({ data: { users } });
  } catch (error) {
    console.error("users", error);
    res.status(500).send({ error: `Cannot fetch users` });
  }
};
