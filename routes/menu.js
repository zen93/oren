var express = require('express');
var router = express.Router();

const Dishes = require('../models/Dishes');
const userController = require('../controllers/userController');

router.get('/dishes', userController.authenticateToken, (req, res) => {
    const dishes = new Dishes();

    return res.send({ success: true, data: { dishes: dishes.getDishes(), beverages: dishes.getBeverages() }})
});

module.exports = router;