const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID.' })
  }

  return next();
}

app.use('/repositories/:id', validateRepositorieId);
app.use('/repositories/:id/like', validateRepositorieId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found'});
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found'})
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(201).json(repositories[repositoryIndex]);

});

module.exports = app;
