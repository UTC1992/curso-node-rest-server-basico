const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req = request, res = response ) => {

  const { correo, password } = req.body;

  try {

    //verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if ( !usuario ) {
      return res.status(400).json({
        msg: 'Usuarios / Password no correctos - correo'
      });
    }

    //si el usuario esta activo
    if ( !usuario.estado ) {
      return res.status(400).json({
        msg: 'Usuarios / Password no correctos - estado : false'
      });
    }

    //verificar la contraseña
    const validPassword = bcryptjs.compareSync( password, usuario.password);
    if ( !validPassword ) {
      return res.status(400).json({
        msg: 'Usuarios / Password no correctos - password'
      });
    }

    //generar JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    }); 

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador'
    });

  }
}

const googleSignin = async( req = request, res = response  ) => {

  const { id_token } = req.body;

  
  try {
    const { correo, nombre, img } = await googleVerify( id_token );
    
    let usuario = await Usuario.findOne({ correo });

    if ( !usuario ) {
      
      const data = {
        nombre,
        correo,
        password: ':D',
        img,
        google: true,
      };

      usuario = new Usuario( data );
      await usuario.save();
    }

    //si el usuario en DB esta en falso
    if ( !usuario.estado ) {
      return res.status( 400 ).json({
        msg: 'Hable con el administrador - Usuario bloqueado'
      });
    }

    //generar JWT
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    res.status( 400 ).json({
      msg: 'Token de google no es valido'
    }); 
  }
}

module.exports = {
  login,
  googleSignin,
}