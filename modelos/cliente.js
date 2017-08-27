//Usa la libreria de la base de datos
var mongoose = require('mongoose');
//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var E_DBF_CLIENTE_OBJ  = mongoose.Schema({
    Ced_Cli: { type: String, required: true, unique: true },
    Nomb_Cli: String,
    Telf_Cli:String,
    Dir_Cli: String,
    Cor_Cli: String,
    Tip_Cli:String,
    Por_Cli:Number
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_CLIENTE = module.exports = mongoose.model('E_DBF_CLIENTE', E_DBF_CLIENTE_OBJ );