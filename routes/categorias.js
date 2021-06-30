const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

//obtener todas las categorias - publico
router.get('/', [
  validarJWT,
], obtenerCategorias );

//obtener una categoria por id - publico
router.get('/:id', [
  validarJWT,
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
router.put('/:id', ( req, res) => {
  res.json('Ok put');
});

//borrar - solo si es ADMIN
router.delete('/:id', ( req, res) => {
  res.json('Ok delete');
});

module.exports = router;