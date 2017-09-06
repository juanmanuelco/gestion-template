var express = require('express'), 
    router = express.Router(),
    passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	E_DBF_USUARIO = require('../modelos/user'),
    bcrypt = require('bcryptjs');
//carga el login 
router.get('/login',function(req,res){
    res.render('login')
})

router.get('/administracion', function(req, res){
	res.render('administracion');
});

// registrar usuarios
router.post('/administracion', function(req, res){
	//exttrae los valores de los input de la parte de administracion
	//y se los asigna a las variables
	var username = req.body.username;
    var password = req.body.password;
	var typoUser = req.body.typoUser;
	//para saber si es administrador
	if(typoUser=="Usuario Normal") {var verificar = '';}else{var verificar = 'administrador';};
    //para que los campos este llenos y no vacios
	req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('typoUser', 'Typo de usuario is required').notEmpty();
   //si se dan errores
	var errors = req.validationErrors();

	if(errors){
		res.render('administracion',{
			errors:errors
		});
	} else {
		//si no se da errores se guardan en el esquema de la bd
		var newUser = new E_DBF_USUARIO({
			username: username,
            password: password,
			typoUser: typoUser,
			verificar: verificar
		});
		//comprueba de que no exista otro ususario con el mismo nombre
		E_DBF_USUARIO.findOne().where({username:req.body.username}).exec((err,resp)=>{
			if(resp!=null){
				//mensaje y redireccionamiento
				req.flash('error_msg','El nombre de usuario ya está registrado en el sistema, intente con otro nombre')
				res.redirect('/admin/administracion');
			}else{
				//crea al usuario 
				E_DBF_USUARIO.createUser(newUser, function(err, user){
					if(err) {throw err};
					req.flash('success_msg', 'Ha sido registrado satisfactoriamente');
					res.redirect('/admin/administracion');
				});
			}
		})
	}
});

//compara los input del login con los del esquema para ver si el usuario exite e ingresa
passport.use(new LocalStrategy(
  function(username, password, done) {
    E_DBF_USUARIO.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
		   return done(null, false, {message: 'El nombre de usuario no está registrado en el sistema'});
   	}

   	E_DBF_USUARIO.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'La contraseña está incorrecta'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    E_DBF_USUARIO.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/users/login');
});

module.exports = router;
    