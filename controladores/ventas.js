var venta_model = require('../modelos/ventas');
var cliente = require('../modelos/cliente');
var productos = require('../modelos/productos');

function obtenerFecha(){
	var date = new Date();
	dia = date.getDate();
	mes = (date.getMonth()) + 1;
	anio = date.getFullYear();
	fecha = dia + "/"+ mes + "/"+anio;
	return fecha;
}

function obtenerVistaVenta(req, res) {
	res.render('ventas')
}
/*function error500(req, res){
	res.render('500', {error:"Error del sistema :(", descripcion:"¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente"})
}*/
function registrarVenta(req, res) {
	var params = req.body;
	var nuevaVenta = new venta_model({
		CodVen_Vent: params.codigo_venta,
		Ced_Vent: params.cedula,
		Fech_Vent: params.fecha,
		CodPro_Vent: params.codigo_producto,
		Desc_Vent: params.descuento
	})
	nuevaVenta.save(function (error, resp) {
		if (error) {
			res.render('500', { error: error })
			console.log("Error");
		} else {
			res.render('ventas', { success_msg: 'Guardado' })
			console.log("Guardado");
		}
	})
}

function busquedaCliente(req, res) {
	var cedula = req.params.cedula;
	cliente.findOne({ Ced_Clien: cedula }, (err, clienteObtenido) => {
		if (err) {
			//res.render('500', { error: err })
			res.status(500).send({ error: "Error al buscar" });
		} else {
			if (!clienteObtenido) {
				//res.render('ventas', { error: "El cliente no existe" })
				res.status(404).send({ error: "El cliente no existe" });
			} else {
				//res.render('ventas', {cliente:clienteObtenido});
				res.status(200).send({ cliente: clienteObtenido });
			}
		}
	});
}
function busquedaProducto(req, res) {
	var codigo = req.params.codigo;
	productos.findOne({ Cod_Pod: codigo }, (err, productoObtenido) => {
		if (err) {
			//res.render('500', { error: err })
			res.status(500).send({ error: "Error al buscar" });
		} else {
			if (!clienteObtenido) {
				//res.render('ventas', { error: "El cliente no existe" })
				res.status(404).send({ error: "El producto no existe" });
			} else {
				//res.render('ventas', {cliente:clienteObtenido});
				res.status(200).send({ poducto: productoObtenido });
			}
		}
	});
}
module.exports = { obtenerVistaVenta, registrarVenta, busquedaCliente, busquedaProducto}
