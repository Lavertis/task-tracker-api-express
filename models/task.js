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

const validateCreateTask = (task) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().label("Title"),
        description: Joi.string().min(3).max(50).required().label("Description"),
        dueDate: Joi.date().min("now").label("Due Date"),
        priority: Joi.number().min(1).max(3).label("Priority")
    });

    return schema.validate(task);
};

const validateUpdateTask = (task) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().label("Title"),
        description: Joi.string().min(3).max(50).required().label("Description"),
        completed: Joi.boolean().label("Completed"),
        dueDate: Joi.date().label("Due Date"),
        priority: Joi.number().min(1).max(3).label("Priority")
    });

    return schema.validate(task);
};

module.exports = {Task, validateCreateTask, validateUpdateTask};