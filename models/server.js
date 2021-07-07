const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const swaggerUi = require('swagger-ui-express');
const specs = require('../middlewares/swagger');
const fileUpload = require('express-fileupload');

class Server {
  
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    
    this.path = {
      auth:       '/api/auth',
      buscar:     '/api/buscar',
      categorias: '/api/categorias',
      productos:  '/api/productos',
      usuarios:   '/api/usuarios',
      uploads:   '/api/uploads',
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
    //cargar un archivo
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
    }));
  }

  routes() {
    this.app.use( this.path.auth, require('../routes/auth'));
    this.app.use( this.path.buscar, require('../routes/buscar'));
    this.app.use( this.path.categorias, require('../routes/categorias'));
    this.app.use( this.path.productos, require('../routes/productos'));
    this.app.use( this.path.usuarios, require('../routes/usuarios'));
    this.app.use( this.path.uploads, require('../routes/uploads'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto http://localhost:${ this.port }`)
    })
  }

}

module.exports = Server;