const express = require('express');
const server = express();
server.use(express.json());

const projects = [];

let logReq = 0;

//conta requisções
function requisitions(req, res, next) {
  logReq++;
  console.log(`Requesitions: ${logReq}`);
  return next();
}

server.use(requisitions);

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => String(p.id) === id);
  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }
  return next();
}

function newProject(req, res, next) {
  const { id, title } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Id required.' });
  }
  if (!title) {
    return res.status(400).json({ error: 'Required title.' });
  }
  const project = projects.find(p => String(p.id) == id);
  if (project) {
    return res.status(400).json({ error: 'This project already exists.' });
  }
  return next();
}
//listando todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});
//cadastrando novos projetos
server.post('/projects', newProject, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };
  projects.push(project);
  return res.json(project);
});
//alterando projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Required title.' });
  }
  const project = projects.find(p => String(p.id) === id);
  project.title = title;
  return res.json(project);
});
//excluindo projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => String(p.id) === id);
  projects.splice(project.id, 1);
  return res.send();
});
//incluindo as tarefas no projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => String(p.id) === id);
  project.tasks.push(title);
  return res.json(project);
});
//inicia servidor na porta 3000
server.listen(3000);
