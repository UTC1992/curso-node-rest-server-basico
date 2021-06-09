const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
} = require('../controllers/usuarios');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom( esRoleValido ),
  validarCampos
], usuariosPut);

router.post('/', [
  check('nombre', 'El nombre es requerido').not().isEmpty(),
  check('password', 'El password debe ser de más de 6 letras').isLength({ min: 6 }),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom( existeEmail ),
  //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido ),
  validarCampos
], usuariosPost);

router.delete('/:id', [
  check('id', 'No es un id valido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;