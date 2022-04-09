const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['index.js']
const config = {
    host: 'localhost:5000',
}

swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
    await import('./index.js'); // Your express routes project's root file where the server starts
});