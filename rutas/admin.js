var express = require('express'),
	venta_model = require("../modelos/ventas"),
	E_DBF_PRODUCTO_OBJ = require('../modelos/productos'),
	producto_controller= require('../controladores/productosController')
	empleados_controller = require('../controladores/empleados'),
	cliente_controller = require('../controladores/cliente'),
	E_DBF_CLIENTE_OBJ=require('../modelos/cliente'),
	E_DBF_EMPLEADO_OBJ=require('../modelos/empleados'),
	E_DBF_ACTIVIDADES_OBJ=require('../modelos/actividades'),
	venta_controller = require("../controladores/ventas"),//todas las funciones de venta	
	router = express.Router(),
	multer = require('multer');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		res.redirect('/users/login');
}


//=============================rutas para clientes==============================

router.post('/saveClient', ensureAuthenticated,cliente_controller.createClient)
router.post('/editClient', ensureAuthenticated,cliente_controller.editClient)
router.post('/deleteClient', ensureAuthenticated,cliente_controller.deleteClient)
router.get('/tabla_cliente', ensureAuthenticated, cliente_controller.getAllClients);

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
router.post('/crearProducto', ensureAuthenticated, producto_controller.crearProduct);
router.post('/editarProducto', ensureAuthenticated, producto_controller.editProduct);
router.post('/eliminarProducto', ensureAuthenticated, producto_controller.deletedProduct);
//Obtener los valores de los input para guardarlos en el esquema o eso se supone..

router.get('/inventario', ensureAuthenticated, function (req, res) {
	E_DBF_PRODUCTO_OBJ.find({}, function (err, users) {
		res.render('inventario', { producto: users });
	});
});
router.get('/inventariocliente', ensureAuthenticated, function (req, res) {
	E_DBF_PRODUCTO_OBJ.find({}, function (err, users) {
		res.render('inventario_clientes', { producto: users });
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

//===================Configuracion===============================================//
router.get('/configuracion', ensureAuthenticated, (req, res)=> {res.render('configuracion');});
//===================Configuracion fin===============================================//
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

router.post('/cedula-cliente',(req,res)=>{
	E_DBF_CLIENTE_OBJ.findOne().where({Ced_Cli:req.body.cedula}).count().exec((err,resp)=>{
		res.send(resp+'');
	});
});

router.post('/registrar_actividad',(req,res)=>{
	var nuevaActividad=new E_DBF_ACTIVIDADES_OBJ({
		CedEm_CtrActE:req.body.cedulaEmp,
		FchAs_CtrActE:req.body.fechaAsig,
		HrAsg_CtrActE:req.body.horaAsig,
		HrFnl_CtrActE:req.body.horaFAsig,
		CedCl_CtrActE:req.body.cedulaCli,
		Desct_CtrActE:req.body.descripcion,
		Contd_CtrActE:req.body.contador
	});
	nuevaActividad.save((err,resp)=>{
		if(err)
			res.send('mal');
		else{
			E_DBF_EMPLEADO_OBJ.findOne().where({Ced_Emp:req.body.cedulaEmp}).exec((err,result)=>{
				var conteo=Number(result.Conta_Emp)+1;
				E_DBF_EMPLEADO_OBJ.findOneAndUpdate({Ced_Emp:req.body.cedulaEmp},{Conta_Emp:conteo,Estd_Emp:'No Disponible'}).exec((err,respuesta)=>{
					res.send('ok');
				});
			});
		}
	});
});

router.post('/liberar-empleados',(req,res)=>{
	E_DBF_EMPLEADO_OBJ.findOneAndUpdate({Ced_Emp:req.body.cedulaEmp},{Estd_Emp:'Disponible'}).exec((err,respuesta)=>{
		res.send('ok');
	});
});

router.get('/reportes',ensureAuthenticated,(req,res)=>{
	res.render('reportes');
})
router.get('/reportes-actividades',ensureAuthenticated,(req,res)=>{
	E_DBF_ACTIVIDADES_OBJ.find().exec((err,resp)=>{
		res.render('reporteActividades',{actividades:resp});
	})
	
})
router.get('/tod-empleados',(req,res)=>{
	E_DBF_EMPLEADO_OBJ.find().exec((err,resp)=>{
		res.send(resp)
	})
})
module.exports = router;
