const { response, request } = require("express");
const { Categoria } = require("../models")

const obtenerCategorias = async ( req = request, res = response ) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, categorias ] = await Promise.all([
    Categoria.countDocuments( query ),
    Categoria.find( query )
      .skip( Number( desde ))
      .limit( Number( limite ))
      .populate( 'usuario', 'nombre' ),
  ]);
  res.status( 200 ).json({
    total,
    categorias,
  })
}

const obtenerCategoria = async ( req = request, res = response ) => {
  const { id } = req.params;
  const categoria = await Categoria.findById( id ).populate( 'usuario', 'nombre' );
  res.status( 200 ).json(categoria);
}

const crearCategoria = async ( req = request, res = response ) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if ( categoriaDB ) {
    return res.status( 400 ).json({
      msg: `La categoría ${categoriaDB.nombre}, ya existe`,
    });
  }
  // generar data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria( data );
  // guardar db
  await categoria.save();
  res.status( 201 ).json( categoria );
}

const actualizarCategoria = async ( req = request, res = response ) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const { nombre } = data;

  const categoriaDB = await Categoria.findOne({ nombre });
  if ( categoriaDB ) {
    return res.status( 400 ).json({
      msg: `La categoría ${categoriaDB.nombre}, ya existe`,
    });
  }

  // el new: true es para que retorne el archivo nuevo osea el archivo ya editado
  const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } ); 
  res.json( categoria );
}

const borrarCategoria = async ( req = request, res = response ) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } );
  
  res.json(categoria);
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
}