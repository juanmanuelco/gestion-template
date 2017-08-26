var express = require('express'),
	venta_model = require("../modelos/ventas"),
	E_DBF_PRODUCTO_OBJ = require('../modelos/productos'),
	E_DBF_EMPLEADO_OBJ = require('../modelos/empleados'),
	E_DBF_CLIENTE_OBJ=require('../modelos/cliente')
	router = express.Router(),
	multer = require('multer');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/users/login');
}

router.get('/ventas', ensureAuthenticated, function (req, res) {
	//res.render('ventas');
	res.render('ventas', { incrementar: "00001" })
});

router.post('/ventas', ensureAuthenticated, function (req, res) {
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
})

//===================Productos===============================================//

//renderiza en la ruta /productos la vista productos 
router.get('/productos', ensureAuthenticated, function (req, res) {
	res.render('productos')
});
router.post('/crearProducto', ensureAuthenticated, E_DBF_PRODUCTO_OBJ.crearProduct);
router.post('/editarProducto', ensureAuthenticated, E_DBF_PRODUCTO_OBJ.editProduct);
router.post('/eliminarProducto', ensureAuthenticated, E_DBF_PRODUCTO_OBJ.deletedProduct);
//Obtener los valores de los input para guardarlos en el esquema o eso se supone..

router.get('/inventario', ensureAuthenticated, function (req, res) {
	E_DBF_PRODUCTO_OBJ.find({}, function (err, users) {
		res.render('inventario', { producto: users });
	});
});

router.post('/getProducts', ensureAuthenticated, function (req, res) {
	var query = { 'Cod_Prod': req.body.Cod_Prod};
	E_DBF_PRODUCTO_OBJ.find(query, function (err, users) {
		res.send(users);
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
