const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['index.js']
const config = {
    host: 'localhost:5000',
    info: {
        title: 'Task Tracker API',
        description: 'Task Tracker API documentation',
        version: '1.0.0'
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
    await import('./index.js'); // Your express routes project's root file where the server starts
});