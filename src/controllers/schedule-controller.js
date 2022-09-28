import { prisma } from "../helpers/utils.js";

//Responsavel pela criação de uma consulta, inserindo os dados na tabela schedule
export const create = async (req, reply) => {
  try {
    const { date, status, observation, medicCrm, pacientCpf } = req.body;
    //verifica se o usuario é uma secretaria ou nao
    if (!req.user.crm && !req.user.cpf) {
      const schedule = await prisma.schedule.create({
        data: {
          date,
          status,
          observation,
          medicCrm: Number(medicCrm),
          pacientCpf: Number(pacientCpf),
          secretaryId: req.user.id,
        },
      });
      return reply.status(201).send(schedule);
      //Em caso do usuario nao ser uma secretaria
    } else {
      const schedule = await prisma.schedule.create({
        data: {
          date,
          status,
          observation,
          medicCrm: Number(medicCrm),
          pacientCpf: Number(pacientCpf),
        },
      });
      return reply.status(201).send(schedule);
    }
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Deu problema mermão" });
  }
};

//Responsavel pela atualização do status de alguma determinada consulta
export const update = async (req, reply) => {
  //Necessario receber o id da consulta
  const { id } = req.params;
  try {
    const schedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status: req.body.status },
    });
    return reply.status(200).send(schedule);
  } catch (error) {
    console.log(error);
    reply.status(500).send(error);
  }
};

//Responsavel por trazer as consultas existentes no banco
export const get = async (req, reply) => {
  try {
    //Caso seja secretaria, traz todas as consultas
    if (!req.user.crm && !req.user.cpf) {
      const schedules = await prisma.schedule.findMany({
        include: {
          medic: {
            select: {
              name: true,
              crm: true,
              specialty: true,
            },
          },
          pacient: {
            select: {
              name: true,
              cpf: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return reply.status(201).send(schedules);
      //Caso seja medica, traz somente as consultas do medico logado
    } else if (req.user.crm) {
      const schedules = await prisma.schedule.findMany({
        where: {
          medicCrm: Number(req.user.crm),
        },
        include: {
          medic: {
            select: {
              name: true,
              crm: true,
              specialty: true,
            },
          },
          pacient: {
            select: {
              name: true,
              cpf: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return reply.status(201).send(schedules);
      //Caso seja paciente, traz somente as consultas do paciente logado
    } else if (req.user.cpf) {
      const schedules = await prisma.schedule.findMany({
        where: {
          pacientCpf: Number(req.user.cpf),
        },
        include: {
          medic: {
            select: {
              name: true,
              crm: true,
              specialty: true,
            },
          },
          pacient: {
            select: {
              name: true,
              cpf: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return reply.status(201).send(schedules);
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};
