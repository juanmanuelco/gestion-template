//Usa la libreria de la base de datos
var mongoose = require('mongoose');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var EMAEVENTINV_OBJ  = mongoose.Schema({
	CodVen_Vent: Number,
	Ced_Vent: String,
	NomCli_Vent: String,
	Fech_Vent: String,
	CodPro_Vent: Object,
	Desc_Vent:Number, 
	Total_Vent: Number
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var EMAEVENTINV = module.exports = mongoose.model('E_DBF_VENTA', EMAEVENTINV_OBJ );

