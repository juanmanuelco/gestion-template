var empleados = require('../modelos/empleados');
multer = require('multer');

module.exports.createEmpleado = function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {cb(null, 'recursos/general/imagenes/empleados')},
            filename: function (req, file, cb) {cb(null, 'empleado'+(req.body.Ced_Emp)+'.png')}
        });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){cb(null, true);}else{cb(null, false);}
    }}).single('image_producto');
    upload(req, res, function (err) {
        if(err){res.render('empleados',{error:'Error al cargar la imágen (Error 500)'})}else{
            var objeto = {
                Ced_Emp: req.body.Ced_Emp,
                Nomb_Emp: req.body.Nomb_Emp,
                Telf_Emp: req.body.Telf_Emp,
                Img_Emp:"../general/imagenes/empleados/empleado"+(req.body.Ced_Emp)+".png",
                Tur_Emp: req.body.Tur_Emp,
                Estd_Emp: 'Disponible',
                Conta_Emp:0
            }
            var nuevoEmpleado = new empleados(objeto)
            nuevoEmpleado.save(function(error,resp){
                if(error){
                    res.render('empleados',{error:'Ocurrio un error al intentar registrar el empleado (Error 500)'})
                }else{
                    res.render('empleados',{registro:'Empleado registrado con exito'})
                }
            })
        }
    })
}

module.exports.editEmployeed = function (req, res) {
    var editCedula = req.query.cedula
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {cb(null, 'recursos/general/imagenes/empleados')},
            filename: function (req, file, cb) {cb(null, 'empleado'+(editCedula)+'.png')}
        });
    var upload = multer({ storage: storage,fileFilter:function(req,file,cb){
        if(file.mimetype=='image/png'|| file.mimetype=='image/jpg' || file.mimetype=='image/jpeg'){
            cb(null, true);
        }
        else{
            cb(null, false);
        }
    }}).single('image_producto');

    upload(req, res, function (err) {
        if(err){
            res.render('empleados',{error:'Error al cargar la imágen (Error 500)'})
        }else{
            var cedula = req.body.Ced_Emp;
            var objeto = {
                Nomb_Emp: req.body.Nomb_Emp,
                Telf_Emp: req.body.Telf_Emp,
                Img_Emp:"../general/imagenes/empleados/empleado"+(req.body.Ced_Emp)+".png",
                Tur_Emp: req.body.Tur_Emp
            }
            var query = { 'Ced_Emp': cedula };
            empleados.findOneAndUpdate(query, objeto, { new: false }, function (err, userUpdated) {
                if (err) {
                    res.render('empleados', { message: "Error al actualizar el usuario (Error 500)" });
                } else {
                    if (!userUpdated) {
                        res.render('empleados', {error: "No se ha podido actualizar el usuario (Error 404)"});
                    } else {
                        res.render('empleados', { edicion: 'Datos de empleado editados con exito' })
                    }
                }
            });
        }
    })
}

module.exports.deleteEmployeed = function (req,res) {
    var cedula = req.body.Ced_Emp;
    var query = { 'Ced_Emp': cedula };
    empleados.findOneAndRemove(query, function (err, userUpdated) {
        if (err) {
            res.render('empleados', { message: "Error al borrar el usuario (Error 500)" });
        } else {
            if (!userUpdated) {
                res.render('empleados', {error: "No se ha podido borrar el usuario (Error 404)"});
            } else {
                res.render('empleados', { eliminacion: 'Empleado eliminado con exito' })
            }
        }
    });
}

module.exports.searchAllEmployeed = function (req, res) {
    empleados.find({}, function (err, users) {
        res.render('tabla_empleados', { usuarios: users });
    });   
}

module.exports.getEmployeeByCed = function (req,res) {
    var query = { 'Ced_Emp': req.body.cedula};
    empleados.find(query, function (err, users) {
        res.send(users);
    });
}