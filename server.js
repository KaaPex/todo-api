const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const _ = require('underscore');

var upload = multer(); // for parsing multipart/form-data
var app = express();

app.use(bodyParser.json()); // for parsing application/json

// var jsonParser = bodyParser.json();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.get('/', (req, res) => {
  res.send('Todo API Root');
});

// GET / todos
app.get('/todos', (req, res) => {
  var queryParams = req.query;
  var filteredTodos = todos;

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(todos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(todos, {completed: false});
  }

  res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (typeof todoId != 'number') {
    res.status(404).send();
  } else {
    var matchesTodo = _.findWhere(todos, {id: todoId});
    if (!matchesTodo) {
      res.status(404).send();
    } else {
      res.json(matchesTodo);
    }
  }
});

// POST /todos
app.post('/todos', upload.array(), (req, res, next) => {
  var body =  _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  body.description = body.description.trim();
  body.id = todos.length + 1;
  todos.push(body);

  res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (isNaN(todoId)) {
    res.status(404).json({"error": "id is in incorrect format"});
  } else {
    var matchesTodo = _.findWhere(todos, {id: todoId});
    if (matchesTodo) {
      todos = _.without(todos, matchesTodo);
      res.json(matchesTodo);
    } else {
      res.status(404).json({"error": "no todo found with that id"});
    }
  }
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (_.isNaN(todoId)) {
    res.status(404).json({"error": "id is in incorrect format"});
  } else {
    var matchesTodo = _.findWhere(todos, {id: todoId});
    if (!matchesTodo) {
      res.status(404).json({"error": "no todo found with that id"});
    }

    var body =  _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
      validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
      return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length !== 0) {
      validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
      return res.status(400).send();
    }

    _.extend(matchesTodo, validAttributes);
    res.json(matchesTodo);
  }
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
