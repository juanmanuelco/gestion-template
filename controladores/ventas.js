var venta_model = require('../modelos/ventas');
var cliente = require('../modelos/cliente');
var productos = require('../modelos/productos');


////////////////////////////////////////////////////////////////////////////
function obtenerFecha() {
	var date = new Date();
	dia = date.getDate();
	mes = (date.getMonth()) + 1;
	anio = date.getFullYear();
	fecha = dia + "/" + mes + "/" + anio;
	return fecha;
}

/*
Cod_Prod:{type: Number},
Des_Prod:{type:String},
Exis_Prod:{type:Number},
PrecComp_Pro:{type:String},
PrecVen_Pro: {type:String},
Img_Prod:{type:String}*/

////////////////////////////////////////////////////////////////////////////
/*
function getNextSequenceValue(sequenceName) {
	var datos = counter.findOneAndUpdate({ query: { _id: sequenceName }, update: { $inc: { sequence_value: 1 } }, new: true });
	console.log(datos.sequence_value)
	return datos.sequence_value;
}
*/


/*function error500(req, res){
	res.render('500', {error:"Error del sistema :(", descripcion:"¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente"})
}*/


var CodVen_Vent = 0
var hayRegistros = false
function obtenerVistaVenta(req, res) {
	venta_model.find({}, (err, total) => {
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
	//res.render('ventas', { factura: CodVen_Vent })

}
function obtenerVistaConsultaVentas(req, res) {
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('consulta-ventas', { error: "Error al obtener datos" })
			console.log("Error al consultar ventas")
			//res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.render({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				console.log(ventas)
				res.render('consulta-ventas', { ventas: ventas /*success_msg:"Correcto"*/ });
			}
		}
	});
	//res.render('consulta-ventas', { factura: ventas })
}

function consultarVentas(req, res) {
	//var query = {};
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				//console.log("las ventas son:   "+ventas)
				res.send({ ventas: ventas });
			}
		}
	});
}


function vistaReporteVentas(req, res){
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				console.log("las ventas son:   "+ventas)
				res.render('reporteVentas', { ventas: ventas });
			}
		}
	});
}


/*function consultarProductosVentas(req, res) {
	//var query = {};
	var codigolistado = req.params.idlistado
	venta_model.find({ Cod_Prod: { idlistado: codigolistado } }, function (err, products) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay productos en esta venta")
			} else {
				console.log(products)
				res.send({ products: products })
				//res.render('consulta-ventas', ventas);
			}
		}
	});
}*/

function registrarVenta(req, res) {
	var params = req.body;
	var date = new Date();
	dia = date.getDate();
	mes = (date.getMonth()) + 1;
	anio = date.getFullYear();
	var Fech_Vent = dia + "/" + mes + "/" + anio;

	var nuevaVenta = new venta_model({
		CodVen_Vent: CodVen_Vent,
		Ced_Vent: params.Ced_Vent,
		NomCli_Vent: params.NomCli_Vent,
		Fech_Vent: Fech_Vent,
		CodPro_Vent: params.CodPro_Vent,
		Desc_Vent: params.Desc_Vent,
		Total_Vent: params.Total_Vent
	})
	CodPro_Vent: params.CodPro_Vent
	nuevaVenta.save(function (error, resp) {
		if (error) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
			console.log(error)
			console.log("Error al guardar venta")
		} else {
			//res.render('ventas', { success_msg: 'Guardado' })
			var products = params.CodPro_Vent.productos
			console.log("Los parametros son  "+products)
			for (var i = 0; i < products.length; i++) {
				console.log("Se vendieron " + products[i].cantidad + " " + products[i].descripcion)
				//productos.findOneAndUpdate({ Cod_Prod: products[i].codigo }, (err, productoObtenido) => {
				//console.log("Total en existencia: " + productoObtenido.Existencia)
				//});
				productos.findOneAndUpdate({ Cod_Prod: products[i].codigo }, { Exis_Prod: (products[i].existencia - products[i].cantidad) }, { new: false }, (err, productUpdated) => {
					if (err) {
						//res.render('succesProducts', { error: "Error al actualizar el producto (error 500)" })
						res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
					} else {
						if (!productUpdated) {
							//res.render('succesProducts', { error: "No se ha podido actualizar el producto (error 400)" })
							console.log("No se actualizao la existencia de un producto")
						} else {
							//res.render('succesProducts', { edicion: 'Editado correctamente' })
							console.log("Producto actualizado")
						}
					}
				});
			}
			res.status(200).send("Venta guardada con exito, presione OK para imprimir la factura")
			console.log("Venta Guardada")
		}
	})
	/*var productos = params.CodPro_Vent
	//console.log()
	for (var i = 0; i < productos.length; i++) {
		console.log("Se vendieron " +productos[i].cantidad+" "+productos[i].descripcion)
		productos.findOne({ Cod_Prod: productos[i].codigo }, (err, productoObtenido) => {
			//if (err) {
			//	res.status(500).send({ error: "Error al buscar" })
			//} else {
			//	if (!productoObtenido) {
			//		res.send({ producto: "El producto no existe" })
			//	} else {
				//	res.status(200).send({ producto: productoObtenido })
				//	console.log("Encontrado");
					console.log("Total en existencia: "+productoObtenido.Existencia)
			//	}
		//	}
		});
	}*/
}

function busquedaCliente(req, res) {
	var cedula = req.params.cedula
	cliente.findOne({ Ced_Cli: cedula }, (err, clienteObtenido) => {
		if (err) {
			//res.status(500).send({ error: "Error al buscar" });
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!clienteObtenido) {
				//res.render('ventas', { error: "El cliente no existe" })
				res.send({ cliente: "El cliente no existe" })
			} else {
				//res.render('ventas', {cliente:clienteObtenido});
				res.status(200).send({ cliente: clienteObtenido })
			}
		}
	});
}
function busquedaProducto(req, res) {
	var codigo = req.params.codigo;
	productos.findOne({ Cod_Prod: codigo }, (err, productoObtenido) => {
		if (err) {
			//res.render('500', { error: err })
			res.status(500).send({ error: "Error al buscar" })
		} else {
			if (!productoObtenido) {
				//res.render('ventas', { error: "El cliente no existe" })
				res.send({ producto: "El producto no existe" })
			} else {
				//res.render('ventas', {cliente:clienteObtenido});
				res.status(200).send({ producto: productoObtenido })
				console.log("Encontrado");
			}
		}
	});
}
module.exports = { obtenerVistaVenta, obtenerVistaConsultaVentas, vistaReporteVentas, consultarVentas, registrarVenta, busquedaCliente, busquedaProducto }
