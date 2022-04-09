const express = require('express');
const tasksRouter = express.Router();
const {Task, validateTask} = require('../models/task');
const {getClaimFromToken} = require("../helpers");

tasksRouter.get('/user', async (req, res) => {
    let userId = getClaimFromToken(req, '_id');
    const tasks = await Task.find({owner: userId});
    res.send(tasks);
});

tasksRouter.post('/', async (req, res) => {
    let userId = getClaimFromToken(req, '_id')

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

tasksRouter.delete('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({message: 'Task not found'});

    let userId = getClaimFromToken(req, '_id')
    if (task.owner.toString() !== userId) return res.status(401).send({message: 'Unauthorized'});
    await task.remove();
    
    res.send(task);
});

module.exports = tasksRouter;