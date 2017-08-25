//Usa la libreria de la base de datos
var mongoose = require('mongoose');
//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var E_DBF_CLIENTE_OBJ  = mongoose.Schema({
    Ced_Cli: { type: String, required: true, unique: true },
    Nomb_Cli: String,
    Telf_Cli:Number,
    Dir_Cli: String,
    Cor_Cli: String,
    Tip_Cli:String,
    Por_Cli:Number
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_CLIENTE = module.exports = mongoose.model('E_DBF_CLIENTE', E_DBF_CLIENTE_OBJ );

//Crea un nuevo usuario para que use el sistema_______________________________________________________________________________________________
module.exports.createCliente = function(newUser, callback){
    //Establece el modo de encriptación
    bcrypt.genSalt(10, function(err, salt) {
            newUser.save(callback);
    });
}

//Para poder usar la encriptación es necesario usar estas líneas______________________________________________________________________________

//obtener clientes por el nombre
module.exports.getClienteByName = function(Name, callback){
    var query = {Nomb_Cli: Name};
    EMAEVENTINV.findOne(query, callback);
}
//Obtener clientes por la cedula
module.exports.getClienteByCedula = function(Cedula, callback){
    var query = {Ced_Cli: Cedula};
    EMAEVENTINV.findOne(query, callback);
}
//Obtener clientes por el tipo
module.exports.getClienteByTipo = function(Tipo, callback){
    var query = {Tip_Cli: Tipo};
    EMAEVENTINV.findOne(query, callback);
}


//MONGODB usa su propia indexación por lo que es necesario obtener el id del registro_________________________________________________________
module.exports.getUserById = function(id, callback){
    EMAEVENTINV.findById(id, callback);
}