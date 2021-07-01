const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las categorias - publico
router.get('/', [
  validarJWT,
], obtenerCategorias );

//obtener una categoria por id - publico
router.get('/:id', [
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos,
], obtenerCategoria);

//crear categoria - privado - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria );

//actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos,
], actualizarCategoria );

//borrar - solo si es ADMIN
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeCategoriaPorId ),
  validarCampos,
], borrarCategoria );

module.exports = router;