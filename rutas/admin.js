var express = require('express'),
	venta_model = require("../modelos/ventas"),
	E_DBF_PRODUCTO_OBJ = require('../modelos/productos'),
	E_DBF_EMPLEADO_OBJ = require('../modelos/empleados'),
	E_DBF_CLIENTE_OBJ=require('../modelos/cliente')
	venta_controller = require("../controladores/ventas")//todas las funciones de venta	
	router = express.Router(),
	multer = require('multer');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/users/login');
}

//====================Ventas====================================================//
router.get('/ventas', function (req, res) {
	res.render('ventas',{fecha:fecha})
});
router.get('/buscar/:cedula', venta_controller.busquedaCliente);
router.get('/buscar/:codigo', venta_controller.busquedaProducto);
router.post('/ventas', venta_controller.registrarVenta);

//===================Productos===============================================//

//renderiza en la ruta /productos la vista productos 
router.get('/productos', ensureAuthenticated, function (req, res) {
	res.render('productos')
});
//Obtener los valores de los input para guardarlos en el esquema o eso se supone..
router.post('/productos', function (req, res) {
	//esta línea obtiene el Cod_Prod y valida que solo se repida una vez
	var accion = req.body.accion;
	console.log(accion)
	if (accion) {
		if (accion == "Eliminar") {
			console.log("Eliminar")

			var codigoP = req.body.Cod_Prod;
			var query = { 'Cod_Prod': codigoP };
			E_DBF_PRODUCTO_OBJ.findOneAndRemove(query, function (err, userUpdated) {
				if (err) {
					res.status(500).send({ message: "Error al borrar el producto" });
				} else {
					if (!userUpdated) {
						res.status(404).send({ message: "No se ha podido borrar el producto" });
					} else {
						res.render('productos', { success_msg: 'El producto fue borrado correctamente' })
					}
				}
			});
		}
		else {
			if (accion == "Actualizar") {
				console.log("Actualizar")
				var codigoP = req.body.Cod_Prod;
				var objeto = {
					Descripcion: req.body.Descripcion,
					Existencia: req.body.Exis_Prod,
					PrecComp_Pro: req.body.PrecComp_Pro,
					PrecVen_Pro: req.body.PrecVen_Pro
				}
				var query = { 'Cod_Prod': codigoP };
				E_DBF_PRODUCTO_OBJ.findOneAndUpdate(query, objeto, { new: false }, function (err, userUpdated) {

					if (err) {
						res.status(500).send({ message: "Error al actualizar el producto" });
					} else {
						if (!userUpdated) {
							res.status(404).send({ message: "No se ha podido actualizar el producto" });
						} else {
							res.render('producto', { success_msg: 'Editado correctamente' })
						}
					}
				});
			}
		}
	} else {
		E_DBF_PRODUCTO_OBJ.findOne().where({ Cod_Prod: req.body.Cod_Prod }).exec(function (err, respu) {
			if (respu == null) {
				var nuevoP = new E_DBF_PRODUCTO_OBJ({

					Cod_Prod: req.body.Cod_Prod,
					Descripcion: req.body.Des_Prod,
					Existencia: req.body.Exis_Prod,
					PrecComp_Pro: req.body.PrecComp_Pro,
					PrecVen_Pro: req.body.PrecVen_Pro
				})
				nuevoP.save(function (erro, resp) {
					if (erro) {
						console.log(erro)
						res.render('productos', { error: erro })
					} else {
						res.render('productos', { success_msg: 'Producto guardado correctamente.' })
					}
				})
			} else {
				res.render('productos', { error: 'Ya existe un producto con este código, por favor intente con otro "Código de Producto" consulte el inventario' })
			}
		})
	}
})
router.get('/inventario', ensureAuthenticated, function (req, res) {
	E_DBF_PRODUCTO_OBJ.find({}, function (err, users) {
		res.render('inventario', { producto: users });
	});
});


// router.get('/inventario', ensureAuthenticated,function (req, res) {
// 	var empleadosDisponibles=new Array(), 
// 	empleadoNoDisponibles=new Array();
// 	E_DBF_EMPLEADO_OBJ.find().where({Estd_Emp:'Disponible'}).exec(function(error,disponibles){
// 		empleadosDisponibles=disponibles;
// 		E_DBF_EMPLEADO_OBJ.find().where({Estd_Emp:'No Disponible'}).exec(function(error,Nodisponibles){
// 			empleadoNoDisponibles=Nodisponibles;
// 			res.render('inventario',{disponibles:empleadosDisponibles,noDisponibles:empleadoNoDisponibles});
// 		});
// });
// });

//===================Productos fin===============================================//

router.get('/cliente', ensureAuthenticated, function (req, res) {
	res.render('cliente')
});
router.get('/administracion', ensureAuthenticated, function (req, res) {
	res.render('administracion')
})

router.get('/registro_empleado', ensureAuthenticated, function (req, res) {
	res.render('registro_empleado')
})

router.get('/tabla_empleados', ensureAuthenticated, function (req, res) {
	E_DBF_EMPLEADO_OBJ.find({}, function (err, users) {
		res.render('tabla_empleados', { usuarios: users });
	});
});

router.post('/getEmployeeByCed',function (req,res) {
	var query = { 'Ced_Emp': req.body.cedula};
	E_DBF_EMPLEADO_OBJ.find(query, function (err, users) {
		res.send(users);
	});
})

router.post('/editEmployee',ensureAuthenticated, E_DBF_EMPLEADO_OBJ.editEmployeed)

router.post('/deleteEmployee',ensureAuthenticated, E_DBF_EMPLEADO_OBJ.deleteEmployeed)

//Este codigo funciona para la subida, generen dos rutas mas una para actualizar y otra para eliminar NO TODO AHI MISMO
//Sino preguntenle a Jairo lo que pasa si pones todo en el mismo lugar :v createEmpleado
router.post('/saveEmployee', ensureAuthenticated, E_DBF_EMPLEADO_OBJ.createEmpleado)

router.get('/asignar_empleados', ensureAuthenticated, function (req, res) {
	var empleadosDisponibles = new Array(),
		empleadoNoDisponibles = new Array(),
		Tclientes=new Array();
	E_DBF_EMPLEADO_OBJ.find().where({ Estd_Emp: 'Disponible' }).exec(function (error, disponibles) {
		empleadosDisponibles = disponibles;
		E_DBF_EMPLEADO_OBJ.find().where({ Estd_Emp: 'No Disponible' }).exec(function (error, Nodisponibles) {
			E_DBF_CLIENTE_OBJ.find().exec(function(error,clientes){
				empleadoNoDisponibles = Nodisponibles;
				Tclientes=clientes;
				res.render('Control_Actividades', {
					disponibles: empleadosDisponibles, 
					noDisponibles: empleadoNoDisponibles,
					clientes: Tclientes
				});
			});			
		});
	});
});

router.post('/datos-empleados',function(req,res){
	var cedula=req.body.cedula;
	E_DBF_EMPLEADO_OBJ.findOne().where({Ced_Emp:cedula}).exec(function(err,resp){
		res.send(resp)
	});
});

module.exports = router;
