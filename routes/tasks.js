const express = require('express');
const tasksRouter = express.Router();
const {Task, validateTaskCreate, validateTaskUpdate} = require('../models/task');
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
    let task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        userId: userId,
    });

    const {error} = validateTaskCreate(task);
    if (error) return res.status(400).send({message: error.details[0].message});

    task = await task.save();
    res.send(task);
});

tasksRouter.put('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    let userId = getClaimFromToken(req, '_id')
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    task.title = req.body.title;
    task.description = req.body.description;
    task.dueDate = req.body.dueDate;
    task.completed = req.body.completed;
    task.priority = req.body.priority;

    const {error} = validateTaskUpdate(task);
    if (error) return res.status(400).send({message: error.details[0].message});

    task.save();
    res.send(task);
});

tasksRouter.patch('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    let userId = getClaimFromToken(req, '_id')
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    if (req.body.hasOwnProperty('title')) task.title = req.body.title;
    if (req.body.hasOwnProperty('description')) task.description = req.body.description;
    if (req.body.hasOwnProperty('dueDate')) task.dueDate = req.body.dueDate;
    if (req.body.hasOwnProperty('completed')) task.completed = req.body.completed;
    if (req.body.hasOwnProperty('priority')) task.priority = req.body.priority;

    const {error} = validateTaskUpdate(task);
    if (error) return res.status(400).send({message: error.details[0].message});

    task.save();
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

module.exports = tasksRouter;