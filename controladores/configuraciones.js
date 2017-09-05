var config = require('../modelos/configuraciones');

function saveConfig(req,res) {
    
    var objeto = {
		Name_Local: req.body.Name_Local,
		Email_Local: req.body.Email_Local,
		Name_Owner: req.body.Name_Owner,
		Name_Manager: req.body.Name_Manager,
        IVA: req.body.IVA,
        Exist_Min: req.body.Exist_Min
	}
	var config_empresarial = new config (objeto)
    config.findOneAndUpdate({}, objeto, { upsert: true }, function(error, resp) {
        if (error) {
            res.render('500', {error:"Error del sistema :(",descripcion:"¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente"})
        } else {
            req.session['success_config'] = 'Datos modificados con éxito';
            res.redirect('configuracion');
        }
    })
    
}

function getConfig(req,res){
    var msg = req.session.success_config||null;
        req.session.success_config=null;
    config.find({}, function (err, configuracion) {
        var objeto = {
            Name_Local: "",
            Email_Local: "",
            Name_Owner: "",
            Name_Manager: "",
            IVA: "",
            Exist_Min: "",
            success_msg:msg
        }
        if (configuracion.length>=1){
            objeto = {
                Name_Local: configuracion[0].Name_Local,
                Email_Local: configuracion[0].Email_Local,
                Name_Owner: configuracion[0].Name_Owner,
                Name_Manager: configuracion[0].Name_Manager,
                IVA: configuracion[0].IVA,
                Exist_Min: configuracion[0].Exist_Min,
                success_msg:msg
            }
        }
        res.render('configuracion', objeto);
    });
}


module.exports = {saveConfig,getConfig}