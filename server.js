const express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
  id: 1,
  descrioption: 'Meet mom for lunch',
  completed: false
}, {
  id: 2,
  descrioption: 'Go to market',
  completed: false
}, {
  id: 3,
  descrioption: 'Learn JavaScript',
  completed: true
}];

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

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
