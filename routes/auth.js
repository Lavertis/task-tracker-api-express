const authRouter = require("express").Router()
const {User} = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

authRouter.post("/", async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error)
            return res.status(400).send({message: error.details[0].message})

        const user = await User.findOne({email: req.body.email})
        if (!user)
            return res.status(401).send({message: "User with this email does not exist"})

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({message: "Wrong password"})

        const token = user.generateAuthToken();
        res.status(200).send({data: token, message: "Successfully logged in"})
        console.log('asfd')
    } catch (error) {
        res.status(500).send({message: "Internal server error"})
    }
})

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = authRouter