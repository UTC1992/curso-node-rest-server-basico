const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'curso API',
      version: '1.0.0',
      description: 'A simple express api'
    },
    servers: [
      {
        url: "http://localhost:8080"
      }
    ],
  },
  apis: ['../routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;