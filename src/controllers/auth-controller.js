import {
  comparePassword,
  createAccessToken,
  hashPassword,
  prisma,
} from "../helpers/utils.js";

//Responsavel por registrar um novo usuario
export const signup = async (req, reply) => {
  const { email, password: pass, type, name, cellphone } = req.body;
  //criptografa a senha do usuario para proteção
  const password = await hashPassword(pass);

  try {
    //Caso seja medico esse sera o objeto esperado
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
      //Caso seja paciente esse sera o objeto esperado
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
      //Caso seja secrtaria esse sera o objeto esperado
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

//Responsavel por logar um usuario (retorna o accesss token)
export const login = async (req, reply) => {
  try {
    const { email, password } = req.body;

    //Procura em todas as tabelas de usuarios (pacient, medic e secretary)
    let medic = await prisma.medic.findUnique({ where: { email } });
    let pacient = await prisma.pacient.findUnique({ where: { email } });
    let secretary = await prisma.secretary.findUnique({ where: { email } });

    //Verifica se todos são invalidos, caso seja retorna email ou senha invalido
    if (!medic && !pacient && !secretary) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    //Compara a senha recebida com a senha existente no banco, se todos derem invalido retorn email ou senha invalido
    if (
      (medic && !(await comparePassword(password, medic.password))) ||
      (pacient && !(await comparePassword(password, pacient.password))) ||
      (secretary && !(await comparePassword(password, secretary.password)))
    ) {
      return reply.status(401).send({ error: "Invalid email or password" });
    }
    //Verifica qual tipo de user tem informaçã valida e envia os dados corretos
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
