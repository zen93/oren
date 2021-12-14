const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
    email: String,
    items: [
        Object
    ],
});

module.exports = mongoose.model('Cart', Cart);