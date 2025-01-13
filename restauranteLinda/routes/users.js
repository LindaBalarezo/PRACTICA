var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');
//const {authenticate}= require('./authenticate');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
 User.register(new User({ username: req.body.username }),
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

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token:token, status: 'Ha iniciado sesion' });
 
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
