const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, email: this.email}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

const User = mongoose.model("User", userSchema)

const validateUserCreate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        firstName: Joi.string().required().min(2).max(50).label('First name'),
        lastName: Joi.string().required().min(2).max(50).label('Last name')
    }).unknown(true)

    return schema.validate(user)
}

const validateUserUpdate = (user) => {
    const schema = Joi.object({
        email: Joi.string().allow('', null).email().required().label("Email"),
        password: passwordComplexity().allow('', null).required().label("Password"),
        firstName: Joi.string().allow('', null).required().min(2).max(50).label('First name'),
        lastName: Joi.string().allow('', null).required().min(2).max(50).label('Last name')
    }).unknown(true)

    return schema.validate(user)
}

module.exports = {User, validateUserCreate, validateUserUpdate}
