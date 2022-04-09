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

usersRouter.post('/', async (req, res) => {
    try {
        const {error} = validateUser(req.body)
        if (error)
            return res.status(400).send({message: error.details[0].message})

        const user = await User.findOne({email: req.body.email})
        if (user)
            return res.status(409).send({message: "User with this email already exists"})

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({...req.body, password: hashPassword}).save()
        res.status(201).send({message: "User created"})
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

// usersRouter.patch('/:id', (req, res) => {
//     User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send(user)
//         }
//     })
// })

module.exports = usersRouter