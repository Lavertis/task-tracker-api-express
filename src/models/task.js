const mongoose = require('mongoose');
const Joi = require("joi")
const moment = require("moment");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
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
        title: Joi.string().required().min(3).max(50).label('Title'),
        description: Joi.string().allow('', null).max(120).label('Description'),
        priority: Joi.number().required().min(1).max(3).label('Priority'),
        dueDate: Joi.date().required().min(moment().format("YYYY-MM-DD HH:mm")).label('Due date')
    }).unknown(true);

    return schema.validate(task);
};

const validateTaskUpdate = (task) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(50).label('Title'),
        description: Joi.string().allow('', null).max(120).label('Description'),
        completed: Joi.boolean().required().label('Completed'),
        priority: Joi.number().required().min(1).max(3).label('Priority'),
        dueDate: Joi.date().required().label("Due Date")
    }).unknown(true);

    return schema.validate(task);
};

module.exports = {Task, validateTaskCreate, validateTaskUpdate};