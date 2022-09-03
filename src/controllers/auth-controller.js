import {
  comparePassword,
  createAccessToken,
  hashPassword,
  prisma,
} from "../helpers/utils.js";

export const signup = async (req, reply) => {
  const { email, password: pass, type, name, cellphone } = req.body;
  const password = await hashPassword(pass);

  try {
    if (type === "medic") {
      const { password: hashedPassword, ...user } = await prisma.medic.create({
        data: {
          email,
          password,
          crm: Number(req.body.crm),
          name,
          cellphone: Number(cellphone),
          specialty: req.body.specialty,
        },
      });
      reply.send(user);
    } else if (type === "pacient") {
      const { password: hashedPassword, ...user } = await prisma.pacient.create(
        {
          data: {
            email,
            password,
            name,
            cellphone: Number(cellphone),
            cpf: Number(req.body.cpf),
            gender: req.body.gender,
            age: Number(req.body.age),
            neighborhood: req.body.neighborhood,
            city: req.body.city,
            street: req.body.street,
          },
        }
      );
      reply.send(user);
    } else if (type === "secretary") {
      const { password: hashedPassword, ...user } =
        await prisma.secretary.create({
          data: {
            email,
            password,
            name,
            cellphone: Number(cellphone),
          },
        });
      reply.send(user);
    }
  } catch (error) {
    console.log(error);
    reply.status(400).send({ error: `User already exists!` });
  }
};

export const login = async (req, reply) => {
  try {
    const { email, password } = req.body;

    let medic = await prisma.medic.findUnique({ where: { email } });
    let pacient = await prisma.pacient.findUnique({ where: { email } });
    let secretary = await prisma.secretary.findUnique({ where: { email } });

    if (!medic && !pacient && !secretary) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    if (
      !(await comparePassword(password, medic.password)) &&
      !(await comparePassword(password, pacient.password)) &&
      !(await comparePassword(password, secretary.password))
    ) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }
    if (medic) {
      let { password: pass, ...data } = medic;
      return reply.send({
        user: data,
        accessToken: await createAccessToken(data),
      });
    } else if (pacient) {
      let { password: pass, ...data } = pacient;
      return reply.send({
        user: data,
        accessToken: await createAccessToken(data),
      });
    } else if (secretary) {
      let { password: pass, ...data } = secretary;
      return reply.send({
        user: data,
        accessToken: await createAccessToken(data),
      });
    }
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Server error!" });
  }
};
