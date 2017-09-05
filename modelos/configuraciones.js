//Usa la libreria de la base de datos
var mongoose = require('mongoose');

//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Esquema de configuracion empresarial
var CONFIG_SIS_OBJ  = mongoose.Schema({
	Name_Local: String,
	Email_Local:String,
	Name_Owner:String,
	Name_Manager:String,
	IVA: Number,
	Exist_Min: Number
});

var CONFIG_SIS = module.exports = mongoose.model('CONFIG_SIS', CONFIG_SIS_OBJ );