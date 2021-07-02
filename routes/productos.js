const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/Productos');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las Productos - publico
router.get('/', [
  validarJWT,
], obtenerProductos );

//obtener una Producto por id - publico
router.get('/:id', [
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos,
], obtenerProducto);

//crear Producto - privado - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un id valido').isMongoId(),
  validarCampos
], crearProducto );

//actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'El id de categoria No es un id valido').isMongoId(),
  validarCampos,
], actualizarProducto );

//borrar - solo si es ADMIN
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos,
], borrarProducto );

module.exports = router;