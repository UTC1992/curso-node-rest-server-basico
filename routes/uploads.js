const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploadsController');
const { coleccionesPermitidas } = require('../helpers');
const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post( '/', [
  validarJWT,
  validarArchivoSubir,
], cargarArchivo );

router.put( '/:coleccion/:id', [
  validarArchivoSubir,
  check( 'id', 'id debe ser de mongo').isMongoId(),
  check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
  validarCampos,
], actualizarImagenCloudinary );
// ], actualizarImagen );

router.get( '/:coleccion/:id', [
  check( 'id', 'id debe ser de mongo').isMongoId(),
  check( 'coleccion' ).custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
  validarCampos,
], mostrarImagen );

module.exports = router;