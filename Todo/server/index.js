const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const ObjectId = require('mongodb').ObjectID;
const config = require('./config/config');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

let db;

mongoose.Promise = global.Promise;

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const bearerHeader = req.get('Authorization');

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    req.token = bearer[1];
    next();
  } else {
    res.sendStatus(403);
  }
};


app.get('/user', verifyToken, (req, res) => {

  jwt.verify(req.token, 'secret', (err, decode) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const {userId, isAdmin} = decode;

      db.collection('users').findOne({'_id': new ObjectId(userId)}, (err, doc) => {
        if (err) {
          return res.sendStatus(500);
        }

        if (!doc) {
          return res.sendStatus(401);
        }

        const {username, tasks} = doc;


        if (isAdmin) {
          db.collection('users').find({'isAdmin': false}).toArray((err, usersList) => {
            if (err) {
              return res.sendStatus(500);
            }

            if (!usersList) {
              return res.sendStatus(401);
            }

            usersList = usersList.map(user => {
              const { _id, username } = user;

              return { _id, username };
            });

            res.send({username, tasks, isAdmin, usersList});

            // res.send({username, tasks});
          })
        } else {
            res.send({username, tasks, isAdmin});
        }

      });
    }
  });
});


app.get('/user/:id', verifyToken, (req, res) => {

  jwt.verify(req.token, 'secret', (err, decode) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const {isAdmin} = decode;

      if (err) {
        return res.sendStatus(500);
      }

      if (isAdmin) {
        const userId = req.params.id;

        db.collection('users').findOne({'_id': new ObjectId(userId)}, (err, doc) => {
          if (err) {
            return res.sendStatus(500);
          }

          if (!doc) {
            return res.sendStatus(401);
          }

          const {username, tasks} = doc;

          return res.send({username, tasks});
        });
      } else {
        return res.sendStatus(403);
      }
    }
  });
});

app.put('/task', verifyToken, (req, res) => {

  jwt.verify(req.token, 'secret', (err, decode) => {

    if (err) {
      res.sendStatus(403);
    } else {

      const {userId} = decode;
      const {taskText, taskFinishDate} = req.body;

      const newTask = {
        text: taskText,
        finishDate: taskFinishDate
      };

      db.collection('users').findOneAndUpdate(
        {'_id': new ObjectId(userId)},
        {$push: {'tasks': newTask}},
        {returnOriginal: false},
        (err, result) => {
          if (err) {
            return res.status(500);
          }

          res.send(200);
        }
      );
    }
  });
});

app.post('/auth', (req, res) => {

  const {username, password} = req.body;

  db.collection('users').findOne({'username': username, 'password': password}, (err, doc) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (!doc) {
      return res.sendStatus(401);
    }

    jwt.sign({userId: doc._id, isAdmin: doc.isAdmin}, 'secret', (err, token) => {
      res.send(token);
    });
  });

});

app.post('/signup', (req, res) => {

  const {username} = req.body;

  db.collection('users').findOne({'username': username}, (err, doc) => {
    if (err) {
      return res.status(500).send('An error occurred during registration');
    }

    if (doc) {
      return res.status(403).send('User already exists.');
    }

    const user = {
      ...req.body,
      tasks: [],
      isAdmin: false
    };

    db.collection('users').insertOne(user, (err, result) => {

      if (err) {
        return res.status(403).send('An error occurred during registration');
      }

      res.send(result);
    });
  });
});

mongoose.connect(config.dbURL, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database;
  app.listen(config.port, function () {
    console.log('Server started');
  })
});


