const express = require("express");
const uuid = require("uuidv4");

const app = express();

app.use(express.json());

const programadores = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();
  console.log(logLabel);
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

function validateContents(request, response) {
  const { nome, sobrenome, idade, empresa, tecnologia } = request.body;

  if (!nome) {
    return response.status(400).json({ error: `Nome não informado` });
  } else if (!sobrenome) {
    return response.status(400).json({ error: `Sobrenome não informado` });
  } else if (!idade) {
    return response.status(400).json({ error: `Idade não informada` });
  } else if (!empresa) {
    return response.status(400).json({ error: `Empresa não informada` });
  } else if (!tecnologia) {
    return response.status(400).json({ error: `Tecnologia não informada` });
  }
}

app.post("/programadores", (request, response) => {
  const { nome, sobrenome, idade, empresa, tecnologias } = request.body;

  const programador = { id: uuid(), title, value, type };

  programadores.push(programador);

  return response.status(201).json(programadores);
});
