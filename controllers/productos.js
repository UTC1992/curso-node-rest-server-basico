const { response, request } = require("express");
const { Producto } = require("../models")

const obtenerProductos = async ( req = request, res = response ) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, productos ] = await Promise.all([
    Producto.countDocuments( query ),
    Producto.find( query )
      .skip( Number( desde ))
      .limit( Number( limite ))
      .populate( 'usuario', 'nombre' )
      .populate( 'categoria', 'nombre' ),
  ]);
  res.status( 200 ).json({
    total,
    productos,
  })
}

const obtenerProducto = async ( req = request, res = response ) => {
  const { id } = req.params;
  const producto = await Producto.findById( id )
    .populate( 'usuario', 'nombre' )
    .populate( 'categoria', 'nombre' );
  res.status( 200 ).json(producto);
}

const crearProducto = async ( req = request, res = response ) => {
  const { nombre, precio, categoria, descripcion } = req.body;
  
  const ProductoDB = await Producto.findOne({ nombre });
  if ( ProductoDB ) {
    return res.status( 400 ).json({
      msg: `El producto ${ProductoDB.nombre}, ya existe`,
    });
  }
  
  // generar data a guardar
  const data = {
    nombre,
    precio,
    categoria,
    descripcion,
    usuario: req.usuario._id,
  };

  const producto = new Producto( data );
  // guardar db
  await producto.save();
  res.status( 201 ).json( producto );
}

const actualizarProducto = async ( req = request, res = response ) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;
  data.usuario = req.usuario._id;

  // el new: true es para que retorne el archivo nuevo osea el archivo ya editado
  const producto = await Producto.findByIdAndUpdate( id, data, { new: true } ); 
  res.json( producto );
}

const borrarProducto = async ( req = request, res = response ) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );
  
  res.json(producto);
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
}