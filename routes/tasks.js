const express = require('express');
const tasksRouter = express.Router();
const {Task, validateTask} = require('../models/task');
const jwt = require("jsonwebtoken");

tasksRouter.get('/', async (req, res) => {
    const tasks = await Task.find().sort('name');
    res.send(tasks);
});

tasksRouter.post('/', async (req, res) => {
    let token = req.header('Authorization');
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const {error} = validateTask(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    let task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        owner: userId
    });
    task = await task.save();

    res.send(task);
});

module.exports = tasksRouter;