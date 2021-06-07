const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    require: [true, 'El nombre es requerido']
  },
  correo: {
    type: String,
    require: [true, 'El corro es requerido'],
    unique: true
  },
  password: {
    type: String,
    require: [true, 'La contraseña es requerida']
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    require: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

//el nombre de la tabla en singular o si se desea se puede confugurar
module.exports = model( 'Usuario', UsuarioSchema );