const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const dishSchema = new Schema({

    name: {
        type: String,
        required: true,
        Unique: true
    },

    price: {
        type: Number,
        required: true,

    },
    description: {
        type: String,
        required: true,

    }
}, {
    timestamps: true

});

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;
