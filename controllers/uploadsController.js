const { response, request } = require("express");
const { subirArchivo } = require("../helpers");

const cargarArchivo = async( req = request, res = response ) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({
        msg: 'No hay archivos en la peticion'
      });
    return;
  }

  try {
    // const nombre = await subirArchivo( req.files, ['docx'], 'textos' );
    const nombre = await subirArchivo( req.files, undefined, 'imgs' );
    res.json({ nombre })
  } catch (msg) {
    res.status(400).json({ msg });
  }
  
}

module.exports = {
  cargarArchivo,
}