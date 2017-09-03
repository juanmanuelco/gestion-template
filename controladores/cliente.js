var cliente = require('../modelos/cliente');

module.exports.editClient=function(req,res){
	var porcentajeDescuento=0;
	if(req.body.Tip_Cli=="Premiun"){
		porcentajeDescuento=5;
	}
	var cedula = req.body.Ced_Cli;
	var objeto = {
		Nomb_Cli: req.body.Nomb_Cli,
		Dir_Cli: req.body.Dir_Cli,
		Telf_Cli: req.body.Telf_Cli,
		Cor_Cli: req.body.Cor_Cli,
		Tip_Cli: req.body.Tip_Cli,
		Por_Cli: porcentajeDescuento
	}
	var query = { 'Ced_Cli': cedula };
	cliente.findOneAndUpdate(query, objeto, { new: false }, function (err, userUpdated) {
		if (err) {
			res.render('500', { error: 'Error al actualizar el cliente'})
		} else {
			if (!userUpdated) {
				res.render('404', {error: "No se ha podido actualizar el usuario (Error 404)"});
			} else {
				req.session['success'] = 'Usuario actualizado con exito';
				res.redirect('tabla_cliente');
			}
		}
	})
}

module.exports.deleteClient=function(req,res){
	var cedula = req.body.Ced_Cli;
    var query = { 'Ced_Cli': cedula };
    cliente.findOneAndRemove(query, function (err, userUpdated) {
        if (err) {
            res.render('500', { error: "Error al borrar el cliente" });
        } else {
            if (!userUpdated) {
                res.render('500', {error: "No se ha podido borrar el cliente"});
            } else {
                req.session['success_client'] = 'Cliente eliminado con éxito';
                res.redirect('tabla_cliente');
            }
        }
	});
}


module.exports.createClient = function (req, res) {
	var params = req.body;
	var porcentajeDescuento=0;
	if(req.body.Tip_Cli=="Premiun"){
		porcentajeDescuento=5;
	}
	var nuevoCliente = new cliente({
		Ced_Cli: req.body.Ced_Cli,
		Nomb_Cli: req.body.Nomb_Cli,
		Dir_Cli: req.body.Dir_Cli,
		Telf_Cli: req.body.Telf_Cli,
		Cor_Cli: req.body.Cor_Cli,
		Tip_Cli: req.body.Tip_Cli,
		Por_Cli: porcentajeDescuento
	})
	nuevoCliente.save(function (error, resp) {
		if (error) {
			res.render('500', {error:"Error del sistema :(",descripcion:"¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente"})
			console.log(error);
		} else {
			res.render('cliente', { success_msg: 'Cliente guardado correctamente.' })
			console.log("Guardado");
		}
	})
}

module.exports.getAllClients = function (req, res) {
    cliente.find({}, function (err, clients) {
		var msg = req.session.success;
		req.session.success=null;
		res.render('tabla_cliente', { clientes: clients,success_msg: msg});
    });   
}
//Para poder usar la encriptación es necesario usar estas líneas______________________________________________________________________________

//obtener clientes por el nombre
module.exports.getClienteByName = function(Name, callback){
    var query = {Nomb_Cli: Name};
    EMAEVENTINV.findOne(query, callback);
}
//Obtener clientes por la cedula
module.exports.getClienteByCedula = function(req, res){
    var query = { 'Ced_Cli': req.body.cedula};
    cliente.find(query, function (err, users) {
        res.send(users);
    });
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