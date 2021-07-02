const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const swaggerUi = require('swagger-ui-express');
const specs = require('../middlewares/swagger');

class Server {
  
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    
    this.path = {
      auth: '/api/auth',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
    }

    //conectar a la base de datos
    this.conectarDB();
    //middlewares
    this.middlewares();
    //rutas de la app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() { //se pueden poner varios middlewares
    //cors
    this.app.use( cors() );
    //swagger
    //this.app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup( specs ) );
    //lectura y parseo del body
    this.app.use( express.json() );
    //directorio publico
    this.app.use( express.static( 'public' ) );
  }

  routes() {
    this.app.use( this.path.auth, require('../routes/auth'));
    this.app.use( this.path.categorias, require('../routes/categorias'));
    this.app.use( this.path.productos, require('../routes/productos'));
    this.app.use( this.path.usuarios, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto http://localhost:${ this.port }`)
    })
  }

}

module.exports = Server;