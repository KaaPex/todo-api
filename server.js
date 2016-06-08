const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

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
  res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (typeof todoId != 'number') {
    res.status(404).send();
  } else {
    var matchesTodo;
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === todoId) {
        matchesTodo = todos[i];
        break;
      }
    }
    if (typeof matchesTodo === 'undefined') {
      res.status(404).send();
    } else {
      res.json(matchesTodo);
    }
  }
});

// POST /todos
app.post('/todos', upload.array(), (req, res, next) => {
  var body = req.body;

  body.id = todos.length + 1;
  todos.push(body);

  res.json(body);
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
