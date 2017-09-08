function alertaOferta(input, val) {
	var imagenAnterior = document.getElementById('img_destino').src;
	if ((val / 1024) > 300) {
		document.getElementById('msgError').style.display="block";
		document.getElementById('file_url').value = ''
		$('#esconder').css("display", "none")
		document.getElementById('img_destino').src = imagenAnterior;
	} else {
		$('#esconder').css("display", "block")
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#img_destino').attr('src', e.target.result);
				document.getElementById('poder').style.display = 'block';
				document.getElementById('msgError').style.display="none";
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
}

textoAnterior={}
function validarUsuario (input) {
	if (input.value.trim() == "" || input.value.length < 10) {return false;};
	var divPadre = input.parentNode
	if (divPadre.classList.contains("is-invalid")) {return false;};
	var span = divPadre.getElementsByTagName("span");
	if (span && textoAnterior[input.id] == undefined) {
		textoAnterior[input.id] = span[0].innerHTML;
	};
	var cedula = input.value
  	$.post("/admin/getEmployeeByCed",
    {
      cedula: cedula,
    },
    function(data,status){
    	if (status == "success") {
    		if (data.length >= 1) {
				span[0].innerHTML = "El empleado con esta cédula ya está registrado en la base de datos";
    			divPadre.classList.add("is-invalid")
    			input.addEventListener("focus", function(){
					var span = this.parentNode.getElementsByTagName("span");
					if (span && textoAnterior[input.id]) {
						span[0].innerHTML=textoAnterior[input.id];
						textoAnterior[input.id]=undefined;
					};
					this.parentNode.classList.remove("is-invalid");
			 	})
    		}
    	}
    });
}



FuncionesEmpleados={}

//funcion unicamente llamada en el modulo de empleado
//para editar datos del empleado se activa con el event click
FuncionesEmpleados["editEmpleado"] = function () {
	var divpadre = this.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	var formhtml = '<form id="editForm" style="text-align: left;" enctype="multipart/form-data" action="/admin/editEmployee?cedula='+datos[0].innerHTML+'" method="post">'+
	'<div class="mdl-grid">'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
				'<label class="text-condensedLight" style="font-size:20px;">Foto del empleado</label>'+
				'<div class="div_file btn">'+
					'<p class="texto">Cambiar imagen (102x102) </p>'+
					'<input type="file" class="btn_enviar mdl-textfield__input" id="file_url" accept=".jpg,.png," name="image_producto" onchange="alertaOferta(this,this.files[0].size)"/>'+
				'</div>'+
			'</div>'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
				'<div id="poder" style="display: block;margin:0 auto; border:solid #000000; height:108px; width:108px;">'+
					'<img style="" src="'+datos[0].id+'" height="102px" width="102px" id="img_destino">'+
				'</div>'+
			'</div>'+
	'</div>'+
	'<span id="msgError" style="display:none;color:#d50000;position:absolute;font-weight: bold;font-size:14px;;margin-top:3px;">Solo se admite fotos de menos de 300kb</span>'+
	
	'<div class="mdl-grid">'+
		'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Cédula</label>'+
				'<input class="mdl-textfield__input" type="text" id="Ced_Emp" name="Ced_Emp" validation="cedula" event="keyup" solonum="true"'+
				' EnterNext="true" idNext="Nomb_Emp" value="'+datos[0].innerHTML+'" readonly="readonly" requerido>'+
				'<label class="mdl-textfield__label" for="Ced_Emp" maxlength="10"></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese Solo Números en Cédula</span>'+
			'</div>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Nombre</label>'+
				'<input class="mdl-textfield__input" type="text" id="Nomb_Emp" name="Nomb_Emp" EnterNext="true" idNext="Telf_Emp" soloLetras="true" maxlength="100" value="'+datos[1].innerHTML+'" requerido>'+
				'<label class="mdl-textfield__label" for="Nomb_Emp" ></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Solo se permite caracteres de la a a la z con tildes y espacios</span>'+
			'</div>'+
		'</div>'+
		'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" style="font-size:20px;">Teléfono</label>'+
				'<input class="mdl-textfield__input" type="text" id="Telf_Emp" value="'+datos[2].innerHTML+'" name="Telf_Emp" solonum="true" EnterNext="true" idNext="Tur_Emp" maxlength="10">'+
				'<label class="mdl-textfield__label" for="Telf_Emp"></label>'+
				'<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese solo números</span>'+
			'</div>'+
			'<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
				'<label class="text-condensedLight" id="Turno" style="font-size:20px;">Turno</label>'+
				'<select class="mdl-textfield__input" id="Tur_Emp" name="Tur_Emp" value="'+datos[3].innerHTML+'">'+
					'<option value="Matutino">Matutino</option>'+
					'<option value="Vespertino">Vespertino</option>'+
					'<option value="Nocturno">Nocturno</option>'+
				'</select>'+
			'</div>'+	
		'</div>'+
	'</div>'+
	'<label id="labelFormModal" style="display:none;color:#d50000;position:absolute;font-size:16px;margin-top:3px;">Por favor asegurese que todos los datos del formulario son correctos </label>'+
	'</form>'
	swal({
		  	title: 'Datos Empleados',
		 	html: formhtml,
	  		width: "550px",
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
			  	title: '¿Seguro que desea modificar los datos del Empleado?',
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
		})
	setTimeout(function (){
            document.getElementById("Tur_Emp").value=datos[3].innerHTML;
			Funciones.init();
		},200);
}

FuncionesEmpleados["saveEmpleado"] = function (e){
	e.preventDefault();
	var form = this.form
	if (!form) {return false}
	var bool = ValidarDatosFormulario(form);
	if (bool){ 
		var foto = document.getElementById("file_url").value ||  ''
		if (foto === '' ) { 
			swal({
			  	title: 'Formulario No Válido',
			  	type: 'error',
			  	text:"Por favor introduzca una foto válida",
			  	showCancelButton: true,
			  	confirmButtonText: 'Ok',
			  	closeOnConfirm: true
			});
			return false
		}
		swal({
			  	title: '¿Seguro que desea registrar este nuevo empleado?',
			  	showCancelButton: true,
			  	confirmButtonText: 'Si',
                cancelButtonText:'No',
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

//funcion unicamente llamada en el modulo de empleado
//para editar datos del empleado se usa unicamente con el event click
FuncionesEmpleados["deleteEmpleado"] = function () {
	var divpadre = this.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	var infoHTML = '<form id="deleteForm" action="/admin/deleteEmployee" method="post"><label>Cedula: '+datos[0].innerHTML+
	'</label><br><label>Nombre: '+datos[1].innerHTML+'</label>';
	infoHTML+='<input type="hidden" name="Ced_Emp" id="Ced_Emp" type="number" value="'+
	datos[0].innerHTML+'" readonly="readonly"></form>';
	noEliminar=false
	$.post("/admin/getEmployeeByCed",
    {
      cedula: datos[0].innerHTML,
    },
    function(data,status){
    	if (status == "success") {
    		if (data.length >= 1) {
    			if (data[0].Estd_Emp != "Disponible") {
    				noEliminar=true
    			};
    			if (noEliminar) {
					swal({
					  	title: 'Error al eliminar este Usuario',
					  	text: "Usuario no puede ser eliminado por que tiene una tarea asignada",
					  	type: 'error',
					  	confirmButtonText: 'Ok'
					})
				}
				else{
					swal({
					  	title: '¿Seguro que desea eliminar los datos de este Empleado?',
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
    	}
    });
}

/*
	PD: las FuncionesEmpleados de edit,delete fueron hechas para crear formularios en modales de esos módulos
	por lo cual no es recomendable intentar usarlas en cosas que no sean tablas
*/

FuncionesEmpleados["init"] = function (argument) {
	var elements=[]
	var inputs = document.getElementsByTagName("input");
	var button = document.getElementsByTagName("button");
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < inputs.length; i++) {elements.push(inputs[i])};
	for (var i = 0; i < button.length; i++) {elements.push(button[i])};
	for (var i = 0; i < divs.length; i++) {elements.push(divs[i])};
	for (var i = 0; i < elements.length; i++) {
			var atributo = elements[i].getAttribute("validation") || false;
			if ( atributo && FuncionesEmpleados[atributo] ){
			var evento = elements[i].getAttribute("event") || false;
			if (evento) {
				var arrayEvent = evento.split(",")
				if (arrayEvent.length > 1) {
					for (var i = 0; i < arrayEvent.length; i++) {
						elements[i].addEventListener(arrayEvent[i],FuncionesEmpleados[atributo]);
					};
				}
				else{
					elements[i].addEventListener(evento,FuncionesEmpleados[atributo]);
				}
			}
			elements[i].addEventListener("change",FuncionesEmpleados[atributo]);
		}
	}
}	

FuncionesEmpleados["infoEmpleado"] = function (argument) {
	var divpadre = this.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
			textHTML='<div id="poder" style="display: block; left: 80%; position: absolute; margin:0 auto">'+
						'<img style="" src="'+datos[0].id+'" height="102px" width="102px" id="img_destino">'+
					'</div>'+
					'<br>'+
	'<div class="mdl-grid">'+
			'<div class="mdl-cell mdl-cell--8-col-phone mdl-cell--16-col-tablet mdl-cell--12-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Cédula</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[0].innerHTML+'" readonly>'+
			'</div>'+
	'</div>'+
	'<div class="mdl-grid">'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Nombre</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[1].innerHTML+'" readonly>'+
					'<br>'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Teléfono</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[2].innerHTML+'" readonly>'+
	'</div>'+
			'<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Turno</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[3].innerHTML+'" readonly>'+
					'<br>'+
					'<label class="text-condensedLight" style="float:left;font-size:20px;">Estado</label>'+
					'<input class="mdl-textfield__input" type="text" value="'+datos[3].id+'" readonly>'+
			'</div>'+
	'</div>'

	swal({
	  	title: 'Información del Empleado',
	  	html: textHTML,
	  	width: "550px",
	  	confirmButtonText: 'Ok',
	  	closeOnConfirm: true
	});
} 
FuncionesEmpleados.init();