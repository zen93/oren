var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', ...userController.validate(), function(req, res) {
    userController
        .registerUser(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

router.post('/login', ...userController.validateLogin(), (req, res) => {
    userController
        .login(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

router.get('/profile', userController.authenticateToken, (req, res) => {
    userController
        .getProfile(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});
    
router.put('/edit', userController.authenticateToken, ...userController.validateProfile(), (req, res) => {
    userController
        .editUser(req, res)
        .catch(err => res.status(400).send({ success: false, message: err.message }));
});

module.exports = router;
