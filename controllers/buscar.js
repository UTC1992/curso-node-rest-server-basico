const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models/index');

const coleccionesPermitidas = [
  'categorias',
  'productos',
  'usuarios',
  'roles',
];

const buscarUsuarios = async( termino = '', res = response) => {

  const esMongoId = ObjectId.isValid( termino ); // TRUE 

  if ( esMongoId ) {
    const usuario =  await Usuario.findById( termino );
    return res.json({
      results: (usuario) ? [ usuario ] : [],
    })
  }

  const regex = new RegExp( termino, 'i' );

  const [ usuarios, total ] = await Promise.all([
    await Usuario.find({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }]
    }),
    await Usuario.countDocuments({
      $or: [{ nombre: regex }, { correo: regex }],
      $and: [{ estado: true }]
    }),
  ])

  return res.json({
    total,
    results: usuarios,
  })
}

const buscarCategorias = async( termino = '', res = response) => {

  const esMongoId = ObjectId.isValid( termino ); // TRUE 

  if ( esMongoId ) {
    const categoria =  await Categoria.findById( termino );
    return res.json({
      results: (categoria) ? [ categoria ] : [],
    })
  }

  const regex = new RegExp( termino, 'i' );

  const [ categorias, total ] = await Promise.all([
    await Categoria.find({ nombre: regex, estado: true }),
    await Categoria.countDocuments({ nombre: regex, estado: true }),
  ])

  res.json({
    total,
    results: categorias,
  })
}

const buscarProductos = async( termino = '', res = response) => {

  const esMongoId = ObjectId.isValid( termino ); // TRUE 

  if ( esMongoId ) {
    const producto =  await Producto.findById( termino )
      .populate('categoria', 'nombre');
    return res.json({
      results: (producto) ? [ producto ] : [],
    })
  }

  const regex = new RegExp( termino, 'i' );

  const [ productos, total ] = await Promise.all([
    await Producto.find({ nombre: regex, estado: true })
    .populate('categoria', 'nombre'),
    await Producto.countDocuments({ nombre: regex, estado: true }),
  ])

  res.json({
    total,
    results: productos,
  })
}

const buscar = ( req = request, res = response ) => {

  const { coleccion, termino } = req.params;

  if ( !coleccionesPermitidas.includes( coleccion )) {
    return res.status( 400 ).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'categorias':
      buscarCategorias( termino, res );
      break;
    case 'productos':
      buscarProductos( termino, res );
      break;
    case 'usuarios':
      buscarUsuarios( termino, res );
      break;
    default:
      res.status( 500 ).json({
        msg: 'Se le olvido hacer esta busqueda',
      });
  }

}

module.exports = {
  buscar,
}