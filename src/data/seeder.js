require('dotenv').config()
const connection = require('./db')
const {Task} = require("../models/task");

const getRandomBoolean = () => {
    return Math.random() >= 0.5
}

const getRandomPriority = () => {
    return Math.floor(Math.random() * (3 - 1 + 1)) + 1
}

const getRandomDate = () => {
    const start = new Date(2022, 3, 15)
    const end = new Date(2022, 6, 1)
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const seed = async () => {
    connection()
    const userId = '6259f8ae9758bca5ee923131'
    let tasks = []
    for (let i = 1; i <= 43; i++) {
        tasks.push({
            title: `Task ${i}`,
            description: `Task ${i} description`,
            completed: getRandomBoolean(),
            priority: getRandomPriority(),
            dueDate: getRandomDate(),
            userId: userId
        })
    }

    await Task.deleteMany({userId: userId})
    await Task.insertMany(tasks)
}

seed().then(() => {
    console.log('Seeded')
    process.exit(0)
})