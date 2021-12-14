const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const User = require('../models/User');

generateAccessToken = (email) => {
    return jwt.sign({ email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, config.jwtSecret , (err, user) => {
        if (err) console.error(err);
        
        if(err) return res.sendStatus(403);

        req.user = user;
    });

    next();
}

validateLogin = () => {
    return [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: config.passwordLength })
    ];
}

validate = () => {
    //Regex
    const specialChars = /[^A-Za-z0-9]/;
    const letters = /[A-Za-z]/;
    const numbers = /[0-9]/;

    return [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: config.passwordLength })
            .matches(specialChars)
            .matches(letters)
            .matches(numbers),
        body('name').isLength({ min: config.nameLength }).trim().escape(),
        body('city').isLength({ min: config.cityLength }).trim().escape(),
        body('address').isLength({ min: config.addressLength }).trim().escape(),
    ];
}

validateProfile = () => {
    return [
        // body('email').isEmail().normalizeEmail(),
        body('name').isLength({ min: config.nameLength }).trim().escape(),
        body('city').isLength({ min: config.cityLength }).trim().escape(),
        body('address').isLength({ min: config.addressLength }).trim().escape(),
    ]
}


login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;
        
    let user = await User.findOne({ email, password });
    if (user) {
        let token = generateAccessToken(user.email);

    }
    else throw new Error('User not found or invalid password!');
    const token = generateAccessToken(req.body.email);
    return res.send({ success: true, message: 'Login successful!', token });
}

registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;

    let userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).send({ success: false, message: 'User already exists!' });
    }
    else {
        const user = {
            email,
            password, //Not salted + hashed to save time
            name,
            city,
            address
        }

        let newUser = new User(user);
        let results = await newUser.save();

        return res.send({ success: true, message: 'Registered!'});
    }
}

getProfile = async (req, res) => {
    const email = req.user.email;

    let user = await User.findOne({ email });

    if (user)
        return res.send({ success: true, data: user });
    else
        throw new Error('User does not exist!');
}

editUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.user.email;
    const name = req.body.name;
    const city = req.body.city;
    const address = req.body.address;

    let user = await User.findOneAndUpdate({ email }, { name, city, address });

    if (user) return res.send({ success: true, message: 'User successfully updated!' });
    else throw new Error('User not found!');
}

exports.validate = validate;
exports.validateLogin = validateLogin;
exports.validateProfile = validateProfile;
exports.getProfile = getProfile;
exports.login = login;
exports.editUser = editUser;
exports.registerUser = registerUser;
exports.authenticateToken = authenticateToken;