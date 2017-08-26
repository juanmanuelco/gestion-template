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
router.get('/buscarcliente/:cedula', ensureAuthenticated, venta_controller.busquedaCliente);
router.get('/buscarproducto/:codigo', ensureAuthenticated, venta_controller.busquedaProducto);
router.post('/ventas', ensureAuthenticated, venta_controller.registrarVenta);
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
				console.log(clientes)
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
