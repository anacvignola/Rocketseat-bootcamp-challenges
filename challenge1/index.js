const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

let req = 0;

//conta requisções
function requisitions(req, res, next) {
  req++;
  console.log(`Requesitions: ${req}`);
  return next();
}

server.use(requisitions);

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

function newProject(req, res, next) {
  const { id, title } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Id required." });
  }
  if (!title) {
    return res.status(400).json({ erro: "Required title." });
  }
  const project = projects.find(p => p.id === id);
  if (project) {
    return res.status(400).json({ error: "This project already exists." });
  }
  return next();
}
//listando todos os projetos
server.get("/projects", (req, res) => {
  return res.json(req.projects);
});
//cadastrando novos projetos
server.post("/projects", newProject, (req, res) => {
  const { id, title } = req.body;
  const tasks = [];
  projects.push(id, title, tasks);
  return res.json({ id, title, tasks });
});

server.put("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Required title." });
  }
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

server.listen(3000);
