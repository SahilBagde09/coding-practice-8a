const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running....at localhost/3000/");
    });
  } catch (error) {
    console.log(`Server Error: ${error.message}`);
  }
};

initializeDbAndServer();

// API 1 :-
app.get("/todos/", async (require, request) => {
  let { todo = "", priority = "", status = "" } = request.query;
  todo.replace("%20", " ");
  priority.replace("%20", " ");
  status.replace("%20", " ");
  const getQuery = `SELECT * FROM todo 
    WHERE todo LIKE "%${todo}%" AND priority LIKE "%${priority}%" AND 
    status LIKE "%${status}%";`;
  const resultList = await db.all(getQuery);
  response.send(resultList);
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoOnId = `SELECT * FROM todo WHERE id = ${todoId};`;
  const todo = await db.get(getTodoOnId);
  response.send(todo);
});

//API 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addNewTodoQuery = `INSERT INTO todo 
    (id , todo, priority, status) VALUES 
    (${id}, "${todo}", "${priority}", "${status}");`;
  await db.run(addNewTodoQuery);
  response.send("Todo Successfully Added");
});

//API 4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo = "", priority = "", status = "" } = request.body;
  let toUpdate = "";
  let updateValue;
  let updateMessage = "";
  if (todo !== "") {
    toUpdate = "todo";
    updateValue = todo;
    updateMessage = "Todo Updated";
  } else if (priority !== "") {
    toUpdate = "priority";
    updateValue = priority;
    updateMessage = "Priority Updated";
  } else {
    toUpdate = "status";
    updateValue = status;
    updateMessage = "Status Updated";
  }
  console.log(updateValue);
  const updateTodoItemQuery = `UPDATE todo SET ${toUpdate} = "${updateValue}" 
  WHERE id = ${todoId};`;
  await db.run(updateTodoItemQuery);
  response.send(updateMessage);
});

//API 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoItemQuery = `DELETE FROM todo WHERE id = ${todoId};`;
  await db.run(deleteTodoItemQuery);
  response.send("Todo Deleted");
});

module.exports = app;
