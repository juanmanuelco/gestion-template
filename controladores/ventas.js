var venta_model = require('../modelos/ventas');
var cliente = require('../modelos/cliente');
var productos = require('../modelos/productos');
var config = require('../modelos/configuraciones');


////////////////////////////////////////////////////////////////////////////
function obtenerFecha() {
	var date = new Date();
	dia = date.getDate();
	mes = (date.getMonth()) + 1;
	anio = date.getFullYear();
	fecha = dia + "/" + mes + "/" + anio;
	return fecha;
}


var CodVen_Vent = 0
var hayRegistros = false
function obtenerVistaVenta(req, res) {
	venta_model.find({}, (err, total) => {
		if (err) {
			console.log("error")
		} else {
            config.find({},function (err,configuracion){
                if (!total.length) {//Si no hay nada aun
                    CodVen_Vent = 1
                    res.render('ventas', { factura: CodVen_Vent ,config:configuracion})
                } else {
                    CodVen_Vent = total.length + 1
                    res.render('ventas', { factura: CodVen_Vent,config:configuracion})
                }
            })
		}
	})

}
function obtenerVistaConsultaVentas(req, res) {
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('consulta-ventas', { error: "Error al obtener datos" })
			console.log("Error al consultar ventas")
		} else {
			if (!ventas) {
				res.render({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				res.render('consulta-ventas', { ventas: ventas });
			}
		}
	});
}

function consultarVentas(req, res) {
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
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
				res.render('reporteVentas', { ventas: ventas });
			}
		}
	});
}

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
			var products = params.CodPro_Vent.productos
			for (var i = 0; i < products.length; i++) {
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
