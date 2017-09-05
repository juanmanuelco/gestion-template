var express = require('express'), 
	router = express.Router();
var venta_model = require("../modelos/ventas"),
	E_DBF_PRODUCTO_OBJ = require('../modelos/productos'),
	E_DBF_EMPLEADO_OBJ = require('../modelos/empleados'),
	E_DBF_VENTAS_OBJ = require('../modelos/ventas'),
	E_DBF_USUARIO = require('../modelos/user')
	E_DBF_CLIENTE_OBJ=require('../modelos/cliente');

function ensureAuthenticated(req, res, next) { 
	if (req.isAuthenticated()) { 
		return next(); 
	} else { 
		res.redirect('/users/login'); 
	} 
}
//BLA BLA
//De esta forma mostramos la página principal de nuestra aplicación   
//Ya aprendi muchoddsada
router.get('/',ensureAuthenticated, function(req,res){
    //usamos la cadena JSON despues de la coma ('index',{ESTA ES LA CADENA JSON}), con el fin de poder enviar datos desde aquí hasta el cliente
	//Para que esto funcione debemos poner {{saludo}} en el handlebars correspondiente
	E_DBF_PRODUCTO_OBJ.find().count().exec(function(e,productos){
		E_DBF_EMPLEADO_OBJ.find().count().exec(function(e,empleados){
			E_DBF_CLIENTE_OBJ.find().count().exec(function(e,clientes){
				E_DBF_USUARIO.find().count().exec(function(e,usuarios){
                    E_DBF_VENTAS_OBJ.find().count().exec(function(e,ventas){
                      res.render('index',{
                            Cant_productos:productos,
                            Cant_empleados:empleados,
                            Cant_clientes:clientes,
                            Cant_usuarios:usuarios,
                            Cant_ventas:ventas
                        })  
                    })
				});
			});
		})
	});
})


module.exports = router;
