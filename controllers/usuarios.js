const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async( req = request, res = response ) => {

  //desestructuracion de objetos
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // const usuarios = await Usuario.find( query )
  //   .skip( Number( desde ) )
  //   .limit( Number( limite ) );
  
  // const total = await Usuario.countDocuments( query );

  //desestructuracion de arreglos
  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments( query ),
    Usuario.find( query )
      .skip( Number( desde ) )
      .limit( Number( limite ) )

  ]);

  res.json({
    total,
    usuarios
  });
}

const usuariosPost = async( req, res = response ) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario( { nombre, correo, password, rol } );
  
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

const usuariosPut = async( req, res = response ) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos
  if ( password ) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );

  res.json( usuario );
}

const usuariosPatch = ( req, res = response ) => {
  
  res.json({
    msg: 'patch API controlador'
  });
}

const usuariosDelete = async( req = request, res = response ) => {
  
  const { id } = req.params;

  //const uid = req.uid;

  //borrado fisico
  // const usuario = await Usuario.findByIdAndDelete( id );

  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
  
  res.json(usuario);
}


module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}