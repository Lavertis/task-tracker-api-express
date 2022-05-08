const authRouter = require("express").Router()
const {User} = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

authRouter.post("/", async (req, res) => {
    // #swagger.tags = ["auth"]
    try {
        const {errors} = validate(req.body);
        if (errors)
            return res.status(400).send({errors: errors.details})

        const user = await User.findOne({email: req.body.email})
        if (!user)
            return res.status(401).send({
                errors: [{
                    context: {label: "Email"},
                    message: "User with this email does not exist"
                }]
            })

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword)
            return res.status(401).send({
                errors: [{
                    context: {label: "Password"},
                    message: "Wrong password"
                }]
            })

        const jwtToken = user.generateAuthToken();
        res.status(200).send({jwtToken: jwtToken, message: "Successfully logged in"})
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