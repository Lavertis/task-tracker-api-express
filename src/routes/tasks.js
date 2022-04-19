const express = require('express');
const tasksRouter = express.Router();
const {Task, validateTaskCreate, validateTaskUpdate} = require('../models/task');
const authenticated = require("../middleware/authenticated");

tasksRouter.get('/auth/all', authenticated, async (req, res) => {
    const userId = req.userId;

    let page = req.query.page;
    let limit = req.query.limit;
    if (!page || !limit) {
        const tasks = await Task.find({userId: userId}).sort({dueDate: 1});
        res.send(tasks);
    }

    let count = await Task.countDocuments({userId: userId});
    const tasks = await Task
        .find({userId: userId})
        .sort({dueDate: 1})
        .skip(limit * (page - 1))
        .limit(limit);

    res.send({tasks: tasks, totalCount: count});
});

tasksRouter.get('/:id', authenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    const userId = req.userId;
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    res.send(task);
});

tasksRouter.post('/', authenticated, async (req, res) => {
    const userId = req.userId;

    let task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        userId: userId,
    });

    const {error} = validateTaskCreate(task);
    if (error) return res.status(400).send({message: error.details[0].message});

    task = await task.save();
    res.send(task);
});

tasksRouter.put('/:id', authenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    const userId = req.userId;
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

tasksRouter.patch('/:id', authenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    const userId = req.userId;
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

tasksRouter.delete('/:id', authenticated, async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    const userId = req.userId;
    if (task.userId.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});

    await task.remove();
    res.send(task);
});

module.exports = tasksRouter;