var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');

router.get('/items', userController.authenticateToken, (req, res) => {
    cartController
        .getItems(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
})

router.post('/add', userController.authenticateToken, function(req, res) {
    cartController
        .addItem(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

router.put('/increment', userController.authenticateToken, (req, res) => {
    cartController
        .editItem(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

router.post('/delete', userController.authenticateToken, (req, res) => {
    cartController
        .deleteItem(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

router.post('/delete/all', userController.authenticateToken, (req, res) => {
    cartController
        .deleteAllItems(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

module.exports = router;
