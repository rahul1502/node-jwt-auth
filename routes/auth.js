const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {

    // VALIDATE DATA BEFORE STORING TO THE DB
    const {error} = registerValidation(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    // CHECK IF THE USER ALREADY EXISTS
    const userExist = await User.findOne({email: req.body.email});
    if ( userExist ) return res.status(400).send('user already exists');

    // HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE A NEW USER
    const user = new User({
        name: req.body.name, 
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    }
    catch(err) {
        res.json({ message: err });
    }

});


router.post('/login', async (req, res) => {

    // VALIDATE DATA BEFORE LOGGING IN THE USER
    const {error} = loginValidation(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    // CHECK IF THE USER DOES NOT EXIST
    const user = await User.findOne({email: req.body.email});
    if ( !user ) return res.status(400).send('invalid email');

    // CHECK IF THE PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password); 
    if (!validPassword) return res.status(400).send('invalid password');


    // CREATE AND ASSIGN A JWT TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router;