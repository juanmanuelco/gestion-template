var express = require('express'),
	venta_model = require("../modelos/ventas"),
	E_DBF_PRODUCTO_OBJ = require('../modelos/productos'),
	empleados_controller = require('../controladores/empleados'),
	E_DBF_CLIENTE_OBJ=require('../modelos/cliente'),
	E_DBF_EMPLEADO_OBJ=require('../modelos/empleados'),
	venta_controller = require("../controladores/ventas"),//todas las funciones de venta	
	router = express.Router(),
	multer = require('multer');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/users/login');
}

//====================Ventas====================================================//
router.get('/ventas', ensureAuthenticated, venta_controller.obtenerVistaVenta);
router.get('/buscar/:cedula', ensureAuthenticated, venta_controller.busquedaCliente);
router.get('/buscar/:codigo', ensureAuthenticated, venta_controller.busquedaProducto);
router.post('/ventas', ensureAuthenticated, venta_controller.registrarVenta);
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
router.get('/inventario', ensureAuthenticated,(req, res)=> {
	E_DBF_PRODUCTO_OBJ.find({}, (err, users) =>{
		res.render('inventario', { producto: users });
	});
});


//===================Productos fin===============================================//

router.get('/cliente', ensureAuthenticated, (req, res)=> {res.render('cliente');});
router.get('/administracion', ensureAuthenticated, (req, res)=> {res.render('administracion');});

//===================Empleados===============================================//

router.get('/registro_empleado', ensureAuthenticated, (req, res)=> { res.render('registro_empleado');});

router.get('/tabla_empleados', ensureAuthenticated, empleados_controller.searchAllEmployeed);

router.post('/getEmployeeByCed',empleados_controller.getEmployeeByCed)

router.post('/editEmployee',ensureAuthenticated, empleados_controller.editEmployeed)

router.post('/deleteEmployee',ensureAuthenticated, empleados_controller.deleteEmployeed)

//Este codigo funciona para la subida, generen dos rutas mas una para actualizar y otra para eliminar NO TODO AHI MISMO
//Sino preguntenle a Jairo lo que pasa si pones todo en el mismo lugar :v createEmpleado
router.post('/saveEmployee', ensureAuthenticated, empleados_controller.createEmpleado)

//===================Empleados fin===============================================//


router.get('/asignar_empleados', ensureAuthenticated,  (req, res)=> {
	E_DBF_EMPLEADO_OBJ.find().where({ Estd_Emp: 'Disponible' }).exec((error, disponibles)=> {
		E_DBF_EMPLEADO_OBJ.find().where({ Estd_Emp: 'No Disponible' }).exec((error, Nodisponibles)=> {
			E_DBF_CLIENTE_OBJ.find().exec((error,clientes)=>{
				res.render('Control_Actividades', {
					disponibles: disponibles, 
					noDisponibles: Nodisponibles,
					clientes: clientes	
	});});});});
});

router.post('/datos-empleados',(req,res)=>{
	E_DBF_EMPLEADO_OBJ.findOne().where({Ced_Emp:req.body.cedula}).exec((err,resp)=>{res.send(resp)});
});

module.exports = router;
