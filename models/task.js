const mongoose = require('mongoose');
const Joi = require("joi")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
        default: 1
    },
    dueDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

const validateTaskCreate = (task) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().label("Title"),
        description: Joi.string().min(3).max(50).required().label("Description"),
        dueDate: Joi.date().min("now").required().label("Due Date"),
        priority: Joi.number().min(1).max(3).required().label("Priority")
    }).unknown(true);

    return schema.validate(task);
};

const validateTaskUpdate = (task) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().label("Title"),
        description: Joi.string().min(3).max(50).required().label("Description"),
        completed: Joi.boolean().required().label("Completed"),
        dueDate: Joi.date().required().label("Due Date"),
        priority: Joi.number().min(1).max(3).required().label("Priority")
    }).unknown(true);

    return schema.validate(task);
};

module.exports = {Task, validateTaskCreate, validateTaskUpdate};