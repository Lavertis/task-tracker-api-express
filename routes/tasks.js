const express = require('express');
const tasksRouter = express.Router();
const {Task, validateCreateTask, validateUpdateTask} = require('../models/task');
const {getClaimFromToken} = require("../helpers");

tasksRouter.get('/auth/all', async (req, res) => {
    let userId = getClaimFromToken(req, '_id');
    const tasks = await Task.find({userId: userId}).sort({dueDate: -1});
    res.send(tasks);
});

tasksRouter.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    let userId = getClaimFromToken(req, '_id')
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    res.send(task);
});

tasksRouter.post('/', async (req, res) => {
    let userId = getClaimFromToken(req, '_id')

    const {error} = validateCreateTask(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    let task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        userId: userId,
    });
    task = await task.save();

    res.send(task);
});

tasksRouter.delete('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    let userId = getClaimFromToken(req, '_id')
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});
    await task.remove();

    res.send(task);
});

tasksRouter.put('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    let userId = getClaimFromToken(req, '_id')
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    const {error} = validateUpdateTask(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});

    task.title = req.body.title;
    task.description = req.body.description;
    task.dueDate = req.body.dueDate;
    task.completed = req.body.completed;
    task.priority = req.body.priority;
    task.save();

    res.send(task);
});

module.exports = tasksRouter;