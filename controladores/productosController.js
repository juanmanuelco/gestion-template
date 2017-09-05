var productos = require('../modelos/productos');
multer = require('multer');
//Esta funcion "crearProduct" se exportara y sera llamada en la ruta productos

module.exports.crearProduct=function(req, res){
    var productCod = req.query.Cod_Prod
    var storage = multer.diskStorage({
        //definimos la ruta en la que se guardaran las imagenes de los productos
        destination: function (req, file, cb) {cb(null, 'recursos/general/imagenes/productos')},
            filename: function (req, file, cb) {cb(null, 'productos'+(productCod)+'.png')}
        });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){cb(null, true);}else{cb(null, false);}
    }}).single('image_producto');
    upload(req, res, function (err) {
        if(err){res.render('productos',{error:'Error al cargar la imagen (Error 500)'})}else{
            var pc = req.body.PrecComp_Pro;
            var pcArray = pc.split(",")
            var pcFinal = pc
            if(pcArray[1]){
               if(pcArray[1].length==1){
                    pcFinal = pcArray[0]+","+pcArray[1]+"0"
                  }
            }
            else{
                pcFinal=pcArray[0]+",00"
            }
            
            var pv = req.body.PrecVen_Pro;
            var pvArray = pv.split(",")
            var pvFinal = pv
            if(pvArray[1]){
               if(pvArray[1].length==1){
                    pvFinal = pvArray[0]+","+pvArray[1]+"0"
                  }
            }
            else{
                pvFinal=pvArray[0]+",00"
            }
            
            var nuevoP = new productos({
                Cod_Prod: req.body.Cod_Prod,
                Des_Prod: req.body.Des_Prod,
                Exis_Prod: req.body.Exis_Prod,
                PrecComp_Pro: pcFinal,
                PrecVen_Pro: pvFinal,
                Img_Prod:"../general/imagenes/productos/productos"+(req.body.Cod_Prod)+".png"
            })
            nuevoP.save(function (erro, resp) {
                //En caso de que no se guarde la imagen nos mandara a un error de status 500 
                if (erro) {
                    console.log("error al guardar el producto")
                    console.log(erro)
                    res.render('productos', { error: erro })
                }
                // si todo es correcto  mandaremos a renderizar la vista productos, más con un mensaje
                // de producto guardado  
                else {
                    console.log("producto guardado")
                    res.render('productos', {success_msg: 'Producto guardado correctamente.' })
                }
            })
        }
    })
}
// Esta funcion sera exportada y llamada en la ruta de productos
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
        if(err){res.render('productos',{error:'Error al cargar la imagen (Error 500)'})}else{
            var codigoP = req.body.Cod_Prod;
            var pc = req.body.PrecComp_Pro;
            var pcArray = pc.split(",")
            var pcFinal = pc
            if(pcArray[1]){
               if(pcArray[1].length==1){
                    pcFinal = pcArray[0]+","+pcArray[1]+"0"
                  }
            }
            else{
                pcFinal=pcArray[0]+",00"
            }
            var pv = req.body.PrecVen_Pro;
            var pvArray = pv.split(",")
            var pvFinal = pv
            if(pvArray[1]){
               if(pvArray[1].length==1){
                    pvFinal = pvArray[0]+","+pvArray[1]+"0"
                  }
            }
            else{
                pvFinal=pvArray[0]+",00"
            }
            var objeto = {
                Des_Prod: req.body.Des_Prod,
                Exis_Prod: req.body.Exis_Prod,
                PrecComp_Pro: pcFinal,
                PrecVen_Pro: pvFinal,
                Img_Prod:"../general/imagenes/productos/productos"+(req.body.Cod_Prod)+".png"
            }
            var query = { 'Cod_Prod': codigoP };
            productos.findOneAndUpdate(query, objeto, { new: false }, function (err, userUpdated) {
        
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
                productos.findOneAndRemove(query, function (err, userUpdated) {
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
