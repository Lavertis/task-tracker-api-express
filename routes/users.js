const express = require("express");
const bcrypt = require("bcrypt")
const usersRouter = express.Router()
const {User, validateUser} = require("../models/user")

usersRouter.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
        } else {
            res.send(users)
        }
    });
});

usersRouter.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            res.send(user)
        }
    });
});

usersRouter.post('/', async (req, res) => {
    try {
        const {error} = validateUser(req.body)
        if (error) return res.status(400).send({message: error.details[0].message})

        const found = await User.findOne({email: req.body.email})
        if (found) return res.status(409).send({message: "User with this email already exists"})

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({
            ...req.body,
            password: hashPassword
        })
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send({message: "Internal server error"})
    }
})

usersRouter.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            res.send(user)
        }
    })
})

module.exports = usersRouter