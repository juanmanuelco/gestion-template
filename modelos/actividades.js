//Usa la libreria de la base de datos
var mongoose = require('mongoose');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var E_DBF_ACTIVIDADES_OBJ  = mongoose.Schema({
    CedEm_CtrActE: { type: String},
    FchAs_CtrActE: Date,
    HrAsg_CtrActE:String,
    HrFnl_CtrActE: String,
    CedCl_CtrActE: String,
    Desct_CtrActE:String,
    Contd_CtrActE:Number
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_ACTIVIDADES = module.exports = mongoose.model('E_DBF_ACTIVIDADES', E_DBF_ACTIVIDADES_OBJ );