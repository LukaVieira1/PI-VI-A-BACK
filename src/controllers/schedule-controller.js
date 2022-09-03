import { prisma } from "../helpers/utils.js";

export const create = async (req, reply) => {
  try {
    const { date, status, observation } = req.body;
    console.log(req.body);
    if (req.user.crm) {
      const schedule = await prisma.schedule.create({
        data: {
          date,
          status,
          observation,
          medicCrm: Number(req.user.crm),
        },
      });
      return reply.status(201).send(schedule);
    } else if (req.user.cpf) {
      const schedule = await prisma.schedule.create({
        data: {
          date,
          status,
          observation,
          pacientCpf: Number(req.user.cpf),
        },
      });
      return reply.status(201).send(schedule);
    } else {
      const schedule = await prisma.schedule.create({
        data: {
          date,
          status,
          observation,
          secretaryId: req.user.id,
        },
      });
      return reply.status(201).send(schedule);
    }
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};

export const del = async (req, reply) => {
  const { id } = req.params;
  try {
    const petweet = await prisma.petweet.delete({
      where: {
        id: Number(id),
      },
    });
    reply.status(200).send("Petweet deletado com sucesso");
  } catch (error) {
    if (error.code === "P2025") {
      reply.status(500).send({ error: "Petweet não existe" });
    } else {
      reply.status(500).send({ error: "Deu problema mermão" });
    }
  }
};

export const getAll = async (req, reply) => {
  const { take, skip, page } = req.pagination;
  try {
    const petweetsCount = await prisma.petweet.count();
    const petweets = await prisma.petweet.findMany({
      take,
      skip,
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reply.send({
      petweets,
      pagination: { page, pageCount: Math.ceil(petweetsCount / take) },
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};

export const getByID = async (req, reply) => {
  const { id } = req.params;
  const { take, skip, page } = req.pagination;
  try {
    const petweetsCount = await prisma.petweet.count();
    const petweets = await prisma.petweet.findMany({
      take,
      skip,
      where: {
        user_id: Number(id),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reply.send({
      petweets,
      pagination: { page, pageCount: Math.ceil(petweetsCount / take) },
    });
  } catch (error) {
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};
