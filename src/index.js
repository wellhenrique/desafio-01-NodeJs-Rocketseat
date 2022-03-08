const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const checkUserAccount = users.filter((user) => user.username === username);

  if (!checkUserAccount.length) {
    return response.json({ error: "Username Exists!" });
  }

  request.checkUser = checkUserAccount;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  userAccount = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(userAccount);

  return response.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { checkUser } = request;

  return response.json(checkUser.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { checkUser } = request;
  const { deadline, title } = request.body;

  const newTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    createdAt: new Date(),
  };

  checkUser.todos.push(newTask);

  return response.status(201).send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { checkUser } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = checkUser.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({
      error: "Is not possible update a non-existing todo",
    });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  response.status(201).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;

  const todo = checkUser.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({
      error: "Is not possible update a non-existing todo",
    });
  }

  todo.done = true;

  response.status(201).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { checkUser } = request;
  const { id } = request.params;

  const todo = checkUser.todos.find((todo) => todo.id === id);

  if (!todo) {
    response.status(404).json({
      error: "Is not possible delete a non-existing todo",
    });
  }

  checkUser.todo.splice(todo, 1);

  response.status(204).json(todo);
});

module.exports = app;
