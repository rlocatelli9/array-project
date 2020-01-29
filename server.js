const express = require("express");

const server = express();

server.use(express.json());

const arrProjects = [];

/**
 * Middleware que dá log no número de requisições
 */
server.use((req, res, next) => {
  console.count("Número de requisições");

  next();
});

/**
 * Middleware que verifica se ID do projeto existe
 */

function checkIdExists(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({
      error: "Params ID is required"
    });
  }

  return next();
}

/**
 * Middleware que verificase Title do projeto existe
 */
function checkTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({
      error: "Params TITLE is required"
    });
  }

  return next();
}

/* Middleware utilizado em todas rotas que recebem o ID do
projeto nos parâmetros da URL para verificar se o projeto com aquele ID existe.
Se não existir retorne um erro, caso contrário permita a requisição continuar
normalmente.
 */
function checkProjectinArray(req, res, next) {
  const { id } = req.params;

  if (arrProjects.find(project => project.id === id)) return next();

  return res.status(400).json({
    error: "Project does not exists!"
  });
}

/**
 * Retorna todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json({ arrProjects });
});

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post("/projects", checkIdExists, checkTitleExists, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  arrProjects.push(project);
  return res.json(project);
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id;
 */
server.post(
  "/projects/:id/tasks",
  checkProjectinArray,
  checkTitleExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = arrProjects.find(index => index.id === id);
    project.tasks.push(title);

    return res.json(project);
  }
);

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put(
  "/projects/:id",
  checkProjectinArray,
  checkTitleExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = arrProjects.find(element => element.id === id);
    project.title = title;

    return res.json(project);
  }
);

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete("/projects/:id", checkProjectinArray, (req, res) => {
  const { id } = req.params;

  const index = arrProjects.findIndex(element => element.id === id);
  arrProjects.splice(index, 1);

  return res.sendStatus(200);
});

server.listen(3000, () => {
  console.log("server started!");
});
