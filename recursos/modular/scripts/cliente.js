FuncionesCliente={}

//funcion para agregar clientes
FuncionesCliente["saveCliente"] = function (e){
	e.preventDefault();
	var form = this.form
	if (!form) {return false}
	var bool = ValidarDatosFormulario(form);
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


//funcion pensada como funcion para el modulo de clientes el cual muestra un formulario en un modal
//para editar los datos de un cliente



FuncionesCliente["editClient"] = function () {
	var divpadre = this.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	// agregar en el form un action con la ruta del admin
	var formhtml = '<form id="editForm" action="/admin/editClient" method="post" style="text-align: left;">'+
	'<label style="text-align: left;">Ruc/Cédula: </label>'+
	'<input name="Ced_Cli" class="mdl-textfield__input" type="number" value="'+datos[0].innerHTML+'" readonly="true"><br>'+
	'<label>Nombres</label>'+
	'<input name="Nomb_Cli" class="mdl-textfield__input" type="text" value="'+datos[1].innerHTML+'"><br>'+
	'<label>Dirección</label>'+
	'<input name="Dir_Cli" class="mdl-textfield__input" type="text" value="'+datos[2].innerHTML+'"><br>'+
	'<label>Número</label>'+
	'<input name="Telf_Cli" class="mdl-textfield__input" type="text" value="'+datos[2].id+'"><br>'+
	'<label>Correo Electrónico</label>'+
	'<input name="Cor_Cli" class="mdl-textfield__input" type="text" value="'+datos[3].id+'"><br>'+
	'<label>Tipo Cliente</label>'+
	'<select name="Tip_Cli" class="mdl-textfield__input" value="'+datos[3].innerHTML+'">'+
		'<option>Ocasional</option>'+
		'<option>Premium</option>'+
	'</select><br>'+
	'</form>'
	swal({
		  	title: 'Datos Cliente',
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
			FuncionesCliente.init();
		},200);
}

//funcion pensada como funcion para el modulo de clientes el cual muestra un formulario en un modal
//para borrar los datos de un cliente
FuncionesCliente["deleteClient"] = function() {

	var divpadre = this.parentNode.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	var infoHTML = '<label>Cedula: '+datos[0].innerHTML+'</label><br><label>Nombre: '+datos[1].innerHTML+'</label>';
	swal({
	  	title: '¿Seguro que desea eliminar los datos del cliente?',
	  	html: infoHTML,
	  	type: 'warning',
	  	showCancelButton: true,
	  	confirmButtonText: 'Si'

	},
	function(isConfirm) {
	  	if (isConfirm) {
			    
	    	location.reload(); 
	  	}
	}); 
}


//funcion inicializacion pensada para poder ser llamada en el caso de que se genere nuevos elementos html 
//desde javascript
FuncionesCliente["init"] = function (argument) {
	// se a cambiado la forma de obtener los elementos del html
	// en este caso se recorre por tipo de elemento ya que lo anterior no identificaba los buttons que estaban
	// dentro de tablas como en el inentario
	// se define la variable elements donde se guardaran todos los elementos
	var elements=[]
	// se define los elementos a buscar por medio del tagname
	var inputs = document.getElementsByTagName("input");
	var button = document.getElementsByTagName("button");
	var divs = document.getElementsByTagName("div");
	// con los for se recorren y se insertan en el arrat "elements"
	for (var i = 0; i < inputs.length; i++) {elements.push(inputs[i])};
	for (var i = 0; i < button.length; i++) {elements.push(button[i])};
	for (var i = 0; i < divs.length; i++) {elements.push(divs[i])};
	// con este for recorremos todos los elementos guardados en busca de la validacion y evento
	for (var i = 0; i < elements.length; i++) {
	var atributo = elements[i].getAttribute("validation") || false;

		//Validacion de atributos solonum y solodecimal, por si se quiere usar estas 2 
		//funciones mientras se usa otra como por ejemplo cedula
		var solonum = elements[i].getAttribute("solonum") || false;
		if (solonum) {
			elements[i].addEventListener("keypress",FuncionesCliente["NumeroEntero"])
			elements[i].addEventListener("keyup",FuncionesCliente["NumeroEntero"])
		};
		var solodecimal = elements[i].getAttribute("solodecimal") || false;
		if (solodecimal) {
			elements[i].addEventListener("keypress",FuncionesCliente["NumDecimal"])
			elements[i].addEventListener("keyup",FuncionesCliente["NumDecimal"])
		};
		var soloLetras = elements[i].getAttribute("soloLetras") || false;
		if (soloLetras) {
			elements[i].addEventListener("keypress",FuncionesCliente["soloLetras"])
			elements[i].addEventListener("keyup",FuncionesCliente["soloLetras"])
		};
		var EnterNext = elements[i].getAttribute("EnterNext") || false;
		if (EnterNext) {elements[i].addEventListener("keyup",FuncionesCliente["EnterNext"])};

		if ( atributo && FuncionesCliente[atributo] ){
			var evento = elements[i].getAttribute("event") || false;
			//modificacion del codigo para poder agregar más de 1 evento a las funciones
			if (evento) {
				var arrayEvent = evento.split(",")
				if (arrayEvent.length > 1) {
					for (var i = 0; i < arrayEvent.length; i++) {
						elements[i].addEventListener(arrayEvent[i],FuncionesCliente[atributo]);
					};
				}
				else{
					elements[i].addEventListener(evento,FuncionesCliente[atributo]);
				}
			}
			elements[i].addEventListener("change",FuncionesCliente[atributo]);
			/*elements[i].addEventListener("paste", function (e) {
				e.preventDefault();
				return false;
			});*/
		}
	}
}


FuncionesCliente["infoCliente"] = function (argument) {
	var divpadre = this.parentNode.parentNode
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
	  	title: 'Informacion del Cliente',
	  	html: textHTML,
	  	width: "550px",
	  	confirmButtonText: 'Ok',
	  	closeOnConfirm: true
	});
} 


//inicializa la funcion que recorre el html en busca de los elementos con los atributos explicados
FuncionesCliente.init();