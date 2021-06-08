const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = ( req = request, res = response ) => {

  const { q, nombre = 'no name', page = 1, limit } = req.query;

  res.json({
    msg: 'get API controlador',
    q,
    nombre,
    page,
    limit
  });
}

const usuariosPost = async( req, res = response ) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario( { nombre, correo, password, rol } );

  //verificar correo existe
  const existeEmail = await Usuario.findOne( { correo } );
  if ( existeEmail ) {
    return res.status(400).json({
      msg: 'El correo ya esta registrado'
    });
  }

  //encriptar pass
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );
  
  //guardar db
  await usuario.save();

  res.status(201).json({
    msg: 'post API controlador',
    usuario
  });
}

const usuariosPut = ( req, res = response ) => {

  const { id } = req.params;

  res.json({
    msg: 'put API controlador', 
    id
  });
}

const usuariosPatch = ( req, res = response ) => {
  res.json({
    msg: 'patch API controlador'
  });
}

const usuariosDelete = ( req, res = response ) => {
  res.json({
    msg: 'delete API controlador'
  });
}


module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}