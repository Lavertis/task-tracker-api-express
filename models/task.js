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
    dueDate: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assignedToUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

const validateTask = (task) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required().label("Title"),
        description: Joi.string().min(3).max(50).required().label("Description"),
        dueDate: Joi.date().min("now").label("Due Date"),
    });

    return schema.validate(task);
};

module.exports = {Task, validateTask};