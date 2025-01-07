var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('El usuario ' + req.body.username + ' ya existe');
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Usuario registrado', user: user });
    }, (err) => next(err))
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if (!req.session) {
    var err = new Error('Sesión no inicializada');
    err.status = 500;
    return next(err);
  }
  if(!req.session.user){
    var authheader = req.headers.authorization;
    if (!authheader) {
      var err = new Error('No se ha encontrado credenciales');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({ username: username })
      .then((user) => {
        if (user == null) {
          var err = new Error('Usuario ' + username + ' no encontrado');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Contraseña incorrecta');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Autenticado correctamente');
        }
      })
      .catch((err) => next(err));
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Ya esta autenticado');
    }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('No esta autenticado');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
