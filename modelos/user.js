//Usa la libreria de la base de datos
var mongoose = require('mongoose');

//Usa un alto nivel de encriptación para las contraseñas
var bcrypt = require('bcryptjs');

//Se define un esquema de como iran los datos guardados_______________________________________________________________________________________
var E_DBF_USUARIO_OBJ  = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	typoUser: {
		type: String
	},
	verificar:{
		type: String
	}
  /**
   * Defina en estas líneas los datos que se necesitan salvar de el usuario
   * *es importante conservar los atributo username:{type:String}, password:{type:String}
   * Use formato JSON
   */
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_USUARIO = module.exports = mongoose.model('E_DBF_USUARIO', E_DBF_USUARIO_OBJ );


//Crea un nuevo usuario para que use el sistema_______________________________________________________________________________________________
module.exports.createUser = function(newUser, callback){	
	//Establece el modo de encriptación
	bcrypt.genSalt(10, function(err, salt) {
        //Encripta los datos
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
            //Devuelve una nueva contraseña (la misma ingresada pero encriptada)
            newUser.password = hash;
            //Genera un registro
	        newUser.save(callback);
	    });
	});
}

//Para poder usar la encriptación es necesario usar estas líneas______________________________________________________________________________
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	E_DBF_USUARIO.findOne(query, callback);
}

//MONGODB usa su propia indexación por lo que es necesario obtener el id del registro_________________________________________________________
module.exports.getUserById = function(id, callback){
	E_DBF_USUARIO.findById(id, callback);
}

//Esto es para el login, sirve para comparar la contraseña ingresada con la que esta en el sistema____________________________________________
//No se usa If(){}else{} por motivo de que siempre dira que es false
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
//funcionn de editar usuarios
module.exports.editUsuario=function(req,res){
	//extrae los valores de los inputs del formulario de modificar
    var username = req.body.username;
    var typoUser = req.body.typoUser;
	var password = req.body.password;
	if(typoUser=="Usuario Normal") {var verificar = '';}else{var verificar = 'administrador';};
	//encriptacion de la contraseña ya que el sistema funciona con la contraseña encriptada
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(password,salt,function(err,hash){
			//contraseña encriptada
			password=hash;
			//console.log(password);
			//los guarda
			var objeto = {
				password: password,
				typoUser: typoUser,
				verificar: verificar
			}
			//limpia la contrasena o la elimina para la nueva contrasena
			if(password && password.trim()===""){delete (objeto['password'])}
			//console.log(password);
			var query = {'username':username}
			//actualiza los datos
			E_DBF_USUARIO.findOneAndUpdate(query,objeto, { new: false }, function (err, userUpdated) {
				//console.log(userUpdated['password'])
				if (err) {
					res.render('500', { error: 'Error al actualizar el cliente'})
				} else {
					//console.log(userUpdated); //para saber si recibe algo
					if (!userUpdated) {
						res.render('404', {error: "No se ha podido actualizar el usuario (Error 404)"});
					} else {
						req.session['success'] = 'Usuario actualizado con exito';
						res.redirect('administracion');
					}
				}
			})
		})
	})
	
}
//funcion para eliminar los usuarios
module.exports.deleteUsuario=function(req,res){
	// es para sabir si recibe lago el body console.log(req.body)
	//asi mismo extrae los valores
	var username= req.body.username;
	var query = { 'username': username };
	//eimina al usuario dependiendo del username o el nombre de usuario
    E_DBF_USUARIO.findOneAndRemove(query, function (err, userUpdated) {
        if (err) {
            res.render('500', { error: "Error al borrar el cliente" });
        } else {
            if (!userUpdated) {
                res.render('500', {error: "No se ha podido borrar el cliente"});
            } else {
                req.session['success_client'] = 'Cliente eliminado con éxito';
                res.redirect('administracion');
            }
        }
	});
}
