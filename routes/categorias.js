const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//obtener todas las categorias - publico
router.get('/', ( req, res) => {
  res.json('Ok get');
});

//obtener una categoria por id - publico
router.get('/:id', ( req, res) => {
  res.json('Ok get id ');
});

//crear categoria - privado - cualquier persona con token valido
router.post('/', ( req, res) => {
  res.json('Ok post');
});

//actualizar - privado - cualquier persona con token valido
router.put('/:id', ( req, res) => {
  res.json('Ok put');
});

//borrar - solo si es ADMIN
router.delete('/:id', ( req, res) => {
  res.json('Ok delete');
});

module.exports = router;