const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const Dishes=require('../models/dishes');
const dishRouter = express.Router();
const authenticate = require('../authenticate');

dishRouter.use(bodyParser.json());
dishRouter.route('/')

.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'aplication/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser ,(req, res, next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Plato creado', dish);
        res.statusCode=200;
        res.setHeader('Content-Type', 'aplication/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req, res, next)=>{
    res.statusCode=403;
    res.end('Operacion PUT no válida en este endpoint ')
})

.delete(authenticate.verifyUser ,(req, res, next)=>{
   Dishes.deleteMany({})
   .then((resp)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'aplication/json');
    res.json(resp);
   }, (err) => next(err))
   .catch((err)=>next(err));
}) 

/////////////////////////////////
dishRouter.route('/:dishId')

.get((req, res, next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'aplication/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err)=>next(err));
})

.post((req, res, next)=>{
    res.end('No soportado: ' + req.body.name + ', ' + req.body.description);
})

.put((req, res, next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'aplication/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err)=>next(err));
})

.delete((req, res, next)=>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'aplication/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=>next(err));
})

module.exports = dishRouter