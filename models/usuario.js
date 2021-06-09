const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  correo: {
    type: String,
    required: [true, 'El corro es requerido'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    //enum: ['ADMIN_ROLE', 'USER_ROLE']
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

//debe ser una funcion normal
//porque una funcion de flecha no me permite apuntar o usar el objeto
// => this
UsuarioSchema.methods.toJSON = function() {
  //estoy sacando los campos que no deseo mostrar 
  //y los demas se almacenan en usuario
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

//el nombre de la tabla en singular o si se desea se puede confugurar
module.exports = model( 'Usuario', UsuarioSchema );