const express = require("express");
const bcrypt = require("bcrypt")
const usersRouter = express.Router()
const {User, validateUserUpdate, validateUserCreate} = require("../models/user")
const authenticated = require("../middleware/authenticated");

usersRouter.get('/', (req, res) => {
    // #swagger.tags = ["users"]
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
        } else {
            res.send(users)
        }
    });
});

usersRouter.get('/auth', authenticated, (req, res) => {
    // #swagger.tags = ["users"]
    const userId = req.userId
    User.findById(userId, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            res.send(user)
        }
    });
});

usersRouter.post('/', async (req, res) => {
    // #swagger.tags = ["users"]
    try {
        const {error} = validateUserCreate(req.body)
        if (error) return res.status(400).send({errors: error.details})

        const found = await User.findOne({email: req.body.email})
        if (found) return res.status(409).send({
            errors: [{
                context: {label: "Email"},
                message: "User with this email already exists"
            }]
        })

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        const passwordHash = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            ...req.body,
            password: passwordHash
        })
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send({message: "Internal server error"})
    }
})

usersRouter.patch('/', authenticated, async (req, res) => {
    // #swagger.tags = ["users"]
    const userId = req.userId

    const {error} = validateUserUpdate(req.body);
    if (error) return res.status(400).send({errors: error.details});

    let user = await User.findOne({_id: userId})
    if (!user) return res.status(404).send({message: "User not found"})

    if (req.body.email && req.body.email === user.email)
        return res.status(400).send({
            errors: [{
                context: {label: "Email"},
                message: "That email is your current email"
            }]
        })

    if (req.body.email) {
        const found = await User.findOne({email: req.body.email})
        if (found) return res.status(409).send({
            errors: [{
                context: {label: "Email"},
                message: "User with this email already exists"
            }]
        })
        user.email = req.body.email;
    }
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    user.save();
    res.send(user);
});

usersRouter.delete('/', authenticated, (req, res) => {
    // #swagger.tags = ["users"]
    const userId = req.userId
    User.findByIdAndDelete(userId, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            res.send(user)
        }
    });
})

module.exports = usersRouter