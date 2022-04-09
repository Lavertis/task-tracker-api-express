require('dotenv').config()
const PORT = process.env.PORT || 5000;

const express = require('express');
const cors = require('cors')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const usersRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const tasksRouter = require("./routes/tasks")

const connection = require('./db')
connection()

const app = express();

app.use(cors())
app.use(express.json())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/tasks', tasksRouter)

app.listen(PORT, () =>
    console.log(`App listening on port ${PORT}!`),
);