var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
 user.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registro exitoso' });
        });
      }
    });
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
