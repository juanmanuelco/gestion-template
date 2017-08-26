//Es necesario siempre hacer referencia al API de mongodb
var mongoose = require('mongoose');

//Se crea el esquema necesario_______________________________________________________________________________________________________________
var E_DBF_PRODUCTO_OBJ = mongoose.Schema({
    Cod_Prod:{type: Number},
    Descripcion:{type:String},
    Existencia:{type:Number},
    PrecComp_Pro:{type:String},
    PrecVen_Pro: {type:String},
    Img_Prod:{type:String}
    
});

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var E_DBF_PRODUCTO=module.exports=mongoose.model('E_DBF_PRODUCTO',E_DBF_PRODUCTO_OBJ);
module.exports.crearProduct=function(req, res){
    var productCod = req.query.Cod_Prod
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {cb(null, 'recursos/general/imagenes/productos')},
            filename: function (req, file, cb) {cb(null, 'productos'+(productCod)+'.png')}
        });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){cb(null, true);}else{cb(null, false);}
    }}).single('image_producto');
    upload(req, res, function (err) {
        if(err){res.render('productos',{error:'Error al cargar la imágen (Error 500)'})}else{
            var nuevoP = new E_DBF_PRODUCTO({
                Cod_Prod: req.body.Cod_Prod,
                Descripcion: req.body.Des_Prod,
                Existencia: req.body.Exis_Prod,
                PrecComp_Pro: req.body.PrecComp_Pro,
                PrecVen_Pro: req.body.PrecVen_Pro,
                Img_Prod:"../general/imagenes/productos/productos"+(req.body.Cod_Prod)+".png"
            })
            nuevoP.save(function (erro, resp) {
                if (erro) {
                    console.log("error al guardar el producto")
                    console.log(erro)
                    res.render('productos', { error: erro })
                } else {
                    console.log("producto guardado")
                    res.render('productos', { success_msg: 'Producto guardado correctamente.' })
                }
            })
        }
    })
}
module.exports.editProduct=function(req, res){
    var productCod = req.query.Cod_Prod
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {cb(null, 'recursos/general/imagenes/productos')},
            filename: function (req, file, cb) {cb(null, 'productos'+(productCod)+'.png')}
        });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){cb(null, true);}else{cb(null, false);}
    }}).single('image_producto');
    upload(req, res, function (err) {
        if(err){res.render('productos',{error:'Error al cargar la imágen (Error 500)'})}else{
            var codigoP = req.body.Cod_Prod;
            var objeto = {
                Descripcion: req.body.Des_Prod,
                Existencia: req.body.Exis_Prod,
                PrecComp_Pro: req.body.PrecComp_Pro,
                PrecVen_Pro: req.body.PrecVen_Pro,
                Img_Prod:"../general/imagenes/productos/productos"+(req.body.Cod_Prod)+".png"
            }
            var query = { 'Cod_Prod': codigoP };
            E_DBF_PRODUCTO.findOneAndUpdate(query, objeto, { new: false }, function (err, userUpdated) {
        
                if (err) {
                    res.render('succesProducts', { error: "Error al actualizar el producto (error 500)" })
                } else {
                    if (!userUpdated) {
                        res.render('succesProducts', { error: "No se ha podido actualizar el producto (error 400)" })
                    } else {
                        res.render('succesProducts', { edicion: 'Editado correctamente' })
                    }
                }
            });
        }
    })
}
module.exports.deletedProduct= function(req, res){
                var codigoP = req.body.Cod_Prod;
                var query = { 'Cod_Prod': codigoP };
                E_DBF_PRODUCTO.findOneAndRemove(query, function (err, userUpdated) {
                    if (err) {
                        res.status(500).send({ message: "Error al eliminar el producto (error 500)" });
                    } else {
                        if (!userUpdated) {
                            res.status(404).send({ message: "No se ha podido actualizar el producto (error 400)" });
                        } else {
                            res.render('succesProducts', { eliminacion: 'Borrado correctamente' })
                        }
                    }
                });
}
//Guardar productos

//Esto no se hace ._. 
//Gracias por tu grosera.. ayuda :v
/*
module.exports.createProductos = function(req,res){
    var parametros= req.body
    //json de producto
    newProducto={
        E_DBF_PRODUCTO.Cod_Prod:parametros.Cod_Prod,
        E_DBF_PRODUCTO.Des_Prod: parametros.Des_Prod,
        E_DBF_PRODUCTO.Exis_Prod: parametros.Exis_Prod,
        E_DBF_PRODUCTO.PrecComp_Pro: parametros.PrecComp_Pro,
        E_DBF_PRODUCTO.PrecVen_Pro: parametros.PrecVen_Pro

    };
    //Genera un registro
    newProducto.save(callback);
	    
	//});
}
*/