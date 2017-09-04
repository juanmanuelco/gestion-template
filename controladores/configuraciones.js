var config_model = require('../modelos/ventas');

//Usa la libreria de la base de datos
var mongoose = require('mongoose');

//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Esquema de configuracion empresarial
var CONFIG_EMPRESARIAL_OBJ  = mongoose.Schema({
	Logo_Empresa: String,
	Name_Local: String,
	Email_Local:String,
	Name_Owner:String,
	Name_Manager:String 
});

var CONFIG_EMPRESARIAL = module.exports = mongoose.model('CONFIG_EMPRESARIAL', CONFIG_EMPRESARIAL_OBJ );

//Esquema configuracion del sistema;
var CONFIG_SISTEMA_OBJ  = mongoose.Schema({
	IVA: Number,
	Exist_Min: Number,
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var CONFIG_SISTEMA = module.exports = mongoose.model('CONFIG_SISTEMA', CONFIG_SISTEMA_OBJ );

function saveConfig(req,res) {
	console.log(req)
}
/*
config_model.find({}, (err, total) => {
	if (err) {
		console.log("error")
	} else {
		if (!total.length) {//Si no hay nada aun
			//console.log("Aun no registra ventas")
			CodVen_Vent = 1
			//console.log(total)
			res.render('ventas', { factura: CodVen_Vent })
		} else {
			//console.log("tamaño del onjeto "+total.length)
			CodVen_Vent = total.length + 1
			//console.log("Empieza a incrementar desde " + total.length + 1)
			//console.log(total)
			res.render('ventas', { factura: CodVen_Vent })
		}
	}
})
*/