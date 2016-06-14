"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const _ = require('underscore');
const db = require('./db.js');

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

// GET / todos?completed=false&q=work
app.get('/todos', (req, res) => {
  var queryParams = req.query;
  var where = {};

  if (queryParams.hasOwnProperty('completed')  && (queryParams.completed === 'true')) {
    where.completed = true;
  } else if (queryParams.hasOwnProperty('completed')  && (queryParams.completed === 'false')) {
    where.completed = false;
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    where.description = {
      $like: "%" + queryParams.q + "%"
    };
  }

  db.todo.findAll({where: where}).then( (todos) => {
    res.json(todos);
  }, (e) => {
    res.status(500).send();
  });
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (typeof todoId != 'number') {
    res.status(404).send();
  } else {
     db.todo.findById(todoId).then( (todo) => {
      if (!!todo) {
        res.json(todo);
      } else {
        res.status(404).send();
      }
    }, (e) => {
      res.status(400).json(e);
    });
  }
});

// POST /todos
app.post('/todos', upload.array(), (req, res, next) => {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then((todo) => {
    res.json(todo);
  }, (e) => {
    res.status(400).json(e);
  });

});

//DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (isNaN(todoId)) {
    res.status(404).json({
      "error": "id is in incorrect format"
    });
  } else {

    db.todo.destroy({
      where: {
        id: todoId
      }
    }).then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        res.status(404).json({
          error: 'No todo with id: ' + todoId
        });
      } else {
        res.status(204).send();
      }
    }, (e) => {
      res.status(500).send();
    });
  }
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  var todoId = +req.params.id; // 123abc -> NaN
  if (_.isNaN(todoId)) {
    res.status(404).json({
      "error": "id is in incorrect format"
    });
  } else {

    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if (body.hasOwnProperty('completed')) {
      attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
      attributes.description = body.description;
    }

    db.todo.findById(todoId).then( (todo) => {
      if (todo) {
        todo.update(attributes).then( (todo) => {
          res.json(todo);
        }, (e) => {
          res.status(400).json(e);
        });
      } else {
        res.status(404).send();
      }
    }, () => {
      res.status(500).send();
    });
  }
});

app.post('/users',upload.array() , (req, res, next) => {
  var body = _.pick(req.body, 'email', 'password');

  db.user.create(body).then((user) => {
    res.json(user.toJSON());
  }, (e) => {
    res.status(400).json(e);
  });
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
  });
});
