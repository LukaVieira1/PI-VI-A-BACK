import { prisma } from "../helpers/utils.js";

export const index = async (req, res) => {
  try {
    let users = await prisma.medic.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        crm: true,
        specialty: true,
        cellphone: true,
        schedules: true,
      },
    });
    return res.send({ data: { users } });
  } catch (error) {
    console.error("users", error);
    res.status(500).send({ error: `Cannot fetch users` });
  }
};
