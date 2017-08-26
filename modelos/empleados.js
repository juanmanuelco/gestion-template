//Usa la libreria de la base de datos
var mongoose = require('mongoose');
//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var E_DBF_EMPLEADO_OBJ  = mongoose.Schema({
    Ced_Emp: { type: String, required: true, unique: true },
    Nomb_Emp: String,
    Telf_Emp:Number,
    Tur_Emp: String,
    Estd_Emp: String,
    Img_Emp:String,
    Conta_Emp:Number
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_EMPLEADO = module.exports = mongoose.model('E_DBF_EMPLEADO', E_DBF_EMPLEADO_OBJ );