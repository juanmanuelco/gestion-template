//le da funcion al boton modificar del handlebars administracion
function editarUsuario (e,object) {
    e.preventDefault();
    //carga el formulario
    //extrae los datos
    var divpadre = object.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	// agregar en el form un action con la ruta del admin
	var formhtml = '<form id="editForm" action="/admin/editUsuario" method="post" style="text-align: left;">'+
	'<label style="text-align: left;">Nombre de Usuario </label>'+
	'<input name="username" class="mdl-textfield__input" type="text" value="'+datos[0].innerHTML+'" readonly><br>'+
	'<label>Contraseña</label>'+
	'<input name="password" class="mdl-textfield__input" type="password" value=""><br>'+
	'<label>Tipo de Usuario</label>'+
	'<select class="mdl-textfield__input" name="typoUser" value="'+datos[1].innerHTML+'" >'+
	    '<option value="Administrador Principal" name="typoUser" id="admin">Administrador Principal</option>'+
	    '<option value="Usuario Normal" name="typoUser">Usuario Normal</option>'+
    '</select>'+
    '</form>'
	swal({
		  	title: 'Datos Usuarios',
		 	html: formhtml,
		  	showCancelButton: true,
		  	confirmButtonText: 'Guardar',
		  	closeOnConfirm: false
		},
		function(isConfirm) {
		  	if (isConfirm) {
				var divs = document.getElementsByTagName("div")
				var form;
				for (var i = 0; i < divs.length; i++) {
					if (divs[i].className=="sweet-content") {
						if (divs[i].firstChild.id=="editForm") {
							form=divs[i].firstChild;
							break;
						};
					};
				};
				var bool;
				if (form) {bool = ValidarDatosFormulario(form,true)}
				if (form && !bool) {
					document.getElementById("labelFormModal").style.display="block";
					return false;
				};

		    	swal({
			  	title: '¿Seguro que desea modificar los datos del Usuario?',
			  	type: 'warning',
			  	showCancelButton: true,
			  	confirmButtonText: 'Si',
			  	cancelButtonText:'No'

			},
			function(isConfirm) {
			  	if (isConfirm) {
					document.body.appendChild(form);
					  form.submit(); 
					  
			  	}
			}); 
		  	}
        });
}
///funcion del boton eliminar usuariode administracion
function deleteUser(e,object) {
    e.preventDefault();
    //asi miso el formulario yu los datos que estan en el body
	var divpadre = object.parentNode
	var divButton = divpadre.parentNode
    var datos = divButton.parentNode.getElementsByTagName("td")
    console.log(datos)
	var infoHTML = '<form id="deleteForm" action="/admin/deleteUsuario" method="post"><label>Nombre de usuario: '+datos[0].innerHTML+
    '</label><br><label>tipo de Usuario: '+datos[1].innerHTML+'</label>'+
    '<input type="hidden" value="'+datos[0].innerHTML+'" name="username"> </form>'
    swal({
        title: '¿Seguro que desea eliminar los datos de este Usuario?',
        html: infoHTML,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si'
    },
    function(isConfirm) {
        if (isConfirm) {
            var divs = document.getElementsByTagName("div")
                var form;
                for (var i = 0; i < divs.length; i++) {
                    if (divs[i].className=="sweet-content") {
                        if (divs[i].firstChild.id=="deleteForm") {
                            form=divs[i].firstChild;
                            break;
                        };
                    };
                };
            if (form) {
                document.body.appendChild(form);
                form.submit()
            };
        }
    });
}