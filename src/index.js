const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const programadores = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();
  console.timeEnd(logLabel);
}

function validateDevId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: "Param sent is not a valid UUID" });
  }
  next();
}

function validateContents(request, response, next) {
  const { nome, sobrenome, idade, empresa, tecnologias } = request.body;

  if (!nome) {
    return response.status(400).json({ error: `Nome não informado` });
  } else if (!sobrenome) {
    return response.status(400).json({ error: `Sobrenome não informado` });
  } else if (!idade) {
    return response.status(400).json({ error: `Idade não informada` });
  } else if (!empresa) {
    return response.status(400).json({ error: `Empresa não informada` });
  } else if (!tecnologias) {
    return response.status(400).json({ error: `Tecnologia não informada` });
  }
  next();
}

app.use(logRequest);

app.post("/programadores", validateContents, (request, response) => {
  const { nome, sobrenome, idade, empresa, tecnologias } = request.body;

  const programador = {
    id: uuid(),
    nome,
    sobrenome,
    idade,
    empresa,
    tecnologias,
  };

  programadores.push(programador);

  return response.status(201).json(programador);
});

app.get("/programadores", (request, response) => {
  const { nome } = request.query;

  const programer = nome
    ? programadores.filter((programer) => programer.nome.includes(nome))
    : programadores;

  return response.json(programer);
});

app.put(
  "/programadores/:id",
  validateDevId,
  validateContents,
  (request, response) => {
    const { id } = request.params;

    const { nome, sobrenome, idade, empresa, tecnologias } = request.body;
    const progIndex = programadores.findIndex(
      (programer) => programer.id == id
    );

    if (progIndex < 0) {
      return response.status(400).json({
        error: `Programer not found!`,
      });
    }

    const devUpdate = {
      nome,
      sobrenome,
      idade,
      empresa,
      tecnologias,
    };

    programadores[progIndex] = devUpdate;

    return response.json(devUpdate);
  }
);

app.delete("/programadores/:id", validateDevId, (request, response) => {
  const { id } = request.params;
  const progIndex = programadores.findIndex(
    (programadores) => programadores.id == id
  );

  if (progIndex < 0) {
    return response
      .status(404)
      .json({ error: "delete error: Programador not found!" });
  }
  programadores.splice(progIndex, 1);

  return response.status(204).send();
});

const port = 3333;

app.listen(port, () => {
  console.log(`Back-end started on PORT 3333`);
});
