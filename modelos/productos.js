//Es necesario siempre hacer referencia al API de mongodb
var mongoose = require('mongoose');

//Se crea el esquema necesario_______________________________________________________________________________________________________________
var E_DBF_PRODUCTO_OBJ = mongoose.Schema({
    //Definimos cada uno de los campos que llevara el esquema de Productos que se almacenara 
    // en la base de datos 
    //Tambien definimos el tipo de dato que sera nuestra variable
    Cod_Prod:{ type: Number, required: true, unique: true },
    Des_Prod:{type:String},
    Exis_Prod:{type:Number},
    PrecComp_Pro:{type:String},
    PrecVen_Pro: {type:String},
    Img_Prod:{type:String}
    
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_PRODUCTO=module.exports=mongoose.model('E_DBF_PRODUCTO',E_DBF_PRODUCTO_OBJ);
