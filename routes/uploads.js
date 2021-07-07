const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo } = require('../controllers/uploadsController');
const { validarJWT } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/', [
  validarJWT,
], cargarArchivo );

module.exports = router;