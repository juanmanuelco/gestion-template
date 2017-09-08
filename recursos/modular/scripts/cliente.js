//se obtiene el input del campo de cedula
var inputCed = document.getElementById("Ced_Cli");
if (inputCed) { 
	//se le agrega el evento blur con la funcion de verfificarCliente
	inputCed.addEventListener("blur",VerificarCliente)
};
var textoAnterior={}
//Se verifica si el cliente existe o no en la base de datos
function VerificarCliente(e) {
	//se obtiene la cedula
	var cedula = this.value;
	//si los caracteres ingresados en el input son 10,13 o 14 se ejecuta la condicion
	if (cedula.length == 10 || cedula.length == 13 || cedula.length == 14) {
		//obtenemos el div padre del input
		var divPadre = this.parentNode
		//si el div padre contiene la subclase "is-invalid cancelamos la funcion"
		if (divPadre.classList.contains("is-invalid")) {return false;};
		var span = divPadre.getElementsByTagName("span");
		if (span && textoAnterior[this.id] == undefined) {
			textoAnterior[this.id] = span[0].innerHTML;
		};
		var input = this;
		$.post("/admin/getClienteByCedula",
	    {
	      cedula: cedula,
	    },
	    function(data,status){
	    	if (status == "success") {
	    		if (data.length >= 1) {
	    			if (cedula.length == 10) {
						span[0].innerHTML = "El cliente con esta cédula ya está registrado en la base de datos";
					}
					else{
						if (cedula.length == 13 || cedula.length == 14) {
							span[0].innerHTML = "El cliente con este ruc ya está registrado en la base de datos";
						};
					}
	    			divPadre.classList.add("is-invalid")
	    			input.addEventListener("focus", function(){
						var span = this.parentNode.getElementsByTagName("span");
						if (span && textoAnterior[this.id]) {
							span[0].innerHTML=textoAnterior[this.id];
							textoAnterior[this.id]=undefined;
						};
						this.parentNode.classList.remove("is-invalid");
				 	})
	    		}
	    	}
	    });
	};
}

//funcion para agregar clientes
function saveCliente (e,button){
	e.preventDefault();
	var form = button.form
	if (!form) {return false}
	var bool = ValidarDatosFormulario(form);
	console.log(bool)
	if (bool){ 
	swal({
		  	title: 'Formulario Válido',
		  	type: 'success',
		  	text:"Se guardarán los datos correctamente",
		  	showCancelButton: true,
		  	confirmButtonText: 'Ok',
		  	closeOnConfirm: true
		},
		function(isConfirm) {
		  	if (isConfirm) {
		  		form.submit();
		  	}
		  	else{
		  		return false;
		  	}
		});
	}
}

function editClient (e,button) {
	e.preventDefault();
	var divpadre = button.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	// agregar en el form un action con la ruta del admin
	var formhtml = '<form id="editForm" action="/admin/editClient" method="post" style="text-align: left;">'+
	'<div class="mdl-grid">'+
		'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Cédula</label>'+
				'<input class="mdl-textfield__input" type="text" id="Ced_Cli" name="Ced_Cli" validation="cedula" event="keyup" solonum="true"'+
				' EnterNext="true" idNext="Nomb_Cli" value="'+datos[0].innerHTML+'" readonly="readonly" requerido>'+
				'<label class="mdl-textfield__label" for="Ced_Cli" maxlength="14"></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese Solo Números en Cédula</span>'+
			'</div>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Nombres y Apellidos</label>'+
				'<input class="mdl-textfield__input" type="text" id="Nomb_Cli" name="Nomb_Cli" EnterNext="true" idNext="Dir_Cli" soloLetras="true" maxlength="60" value="'+datos[1].innerHTML+'" requerido>'+
				'<label class="mdl-textfield__label" for="Nomb_Cli" ></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Solo se permite caracteres de la a a la z con tildes y espacios</span>'+
			'</div>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Dirección</label>'+
				'<input class="mdl-textfield__input" type="text" id="Dir_Cli" name="Dir_Cli" EnterNext="true" idNext="Telf_Cli" maxlength="40" value="'+datos[2].innerHTML+'" requerido>'+
				'<label class="mdl-textfield__label" for="Dir_Cli" ></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Solo se permite caracteres de la a a la z con tildes y espacios</span>'+
			'</div>'+
		'</div>'+
		'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Teléfono</label>'+
				'<input class="mdl-textfield__input" type="text" id="Telf_Cli" value="'+datos[2].id+'" name="Telf_Cli" solonum="true" EnterNext="true" idNext="Correo" maxlength="10">'+
				'<label class="mdl-textfield__label" for="Telf_Cli"></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese solo números</span>'+
			'</div>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Correo electrónico</label>'+
				'<input value="'+datos[3].id+'"class="mdl-textfield__input" name="Cor_Cli" type="text" id="Correo" validation="email" maxlength="30" event="keyup,blur">'+
				'<label class="mdl-textfield__label" for="Correo"></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Correo No válido</span>'+
			'</div><br>'+
			'<label class="text-condensedLight" style="font-size:20px;">Tipo Cliente</label>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<select value="'+datos[3].innerHTML+'" class="mdl-textfield__input" name="Tip_Cli" id="Tip_Cli">'+
                    '<option value="Ocasional">Ocasional</option>'+
                    '<option value="Premium">Premium</option>'+
				'</select>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<label id="labelFormModal" style="display:none;color:#d50000;position:absolute;font-size:16px;margin-top:3px;">Por favor asegurese que todos los datos del formulario son correctos </label>'+
	'</form>'
	swal({
		  	title: 'Datos Cliente',
		 	html: formhtml,
		  	showCancelButton: true,
		  	width: '700px',
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
			  	title: '¿Seguro que desea modificar los datos del cliente?',
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
		setTimeout(function (a){
            document.getElementById("Tip_Cli").value=datos[3].innerHTML;
			Funciones.init();
		},200);
}

//funcion pensada como funcion para el modulo de clientes el cual muestra un formulario en un modal
//para borrar los datos de un cliente
function deleteClient(e,button) {
	e.preventDefault();
	var divpadre = button.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	var infoHTML = '<form id="deleteForm" action="/admin/deleteClient" method="post"><label>Cedula: '+datos[0].innerHTML+
	'</label><br><label>Nombre: '+datos[1].innerHTML+'</label>';
	infoHTML+='<input type="hidden" name="Ced_Cli" id="Ced_Cli" type="number" value="'+
	datos[0].innerHTML+'" readonly="readonly"></form>';
	$.post("/admin/getClienteByCedula",
    {
      cedula: datos[0].innerHTML,
    },
    function(data,status){
    	if (status == "success") {
    		if (data.length >= 1) {
    			swal({
					title: '¿Seguro que desea eliminar los datos de este Cliente?',
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
    	}
    });
}

function infoCliente(e,button) {
	e.preventDefault();
	var divpadre = button.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	console.log(datos)
	textHTML=''+
	'<div class="mdl-grid">'+
			'<div class="mdl-cell mdl-cell--8-col-phone mdl-cell--16-col-tablet mdl-cell--12-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Ruc/Cédula</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[0].innerHTML+'" readonly>'+
			'</div>'+
	'</div>'+
	'<div class="mdl-grid">'+
		'<div class="mdl-cell mdl-cell--8-col-phone mdl-cell--16-col-tablet mdl-cell--12-col-desktop">'+
				'<label class="text-condensedLight" style="float:left;font-size:20px;">Nombres</label>'+
				'<input class="mdl-textfield__input" type="text" value="'+datos[1].innerHTML+'" readonly>'+
		'</div>'+
	'</div>'+
	'<div class="mdl-grid">'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Dirección</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[2].innerHTML+'" readonly>'+
					'<br>'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Correo</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[3].id+'" readonly>'+
	'</div>'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Teléfono</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[2].id+'" readonly>'+
					'<br>'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Tipo</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[3].innerHTML+'" readonly>'+
			'</div>'+
	'</div>'

	swal({
	  	title: 'Información del Cliente',
	  	html: textHTML,
	  	width: "550px",
	  	confirmButtonText: 'Ok',
	  	closeOnConfirm: true
	});
} 