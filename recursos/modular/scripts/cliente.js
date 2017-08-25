//funcion pensada como funcion para el modulo de clientes el cual muestra un formulario en un modal
//para editar los datos de un cliente
FuncionesCliente["editClient"] = function () {
	var divpadre = this.parentNode
	var divButton = divpadre.parentNode
	var datos = divButton.parentNode.getElementsByTagName("td")
	var formhtml = '<form style="text-align: left;">'+
	'<label style="text-align: left;">Ruc/Cédula: </label>'+
	'<input class="mdl-textfield__input" type="number" value="'+datos[0].innerHTML+'" disabled="true"><br>'+
	'<label>Nombres</label>'+
	'<input class="mdl-textfield__input" type="text" value="'+datos[1].innerHTML+'"><br>'+
	'<label>Direccion</label>'+
	'<input class="mdl-textfield__input" type="text" value="'+datos[2].innerHTML+'"><br>'+
	'<label>Numero Convencional</label>'+
	'<input class="mdl-textfield__input" type="text" value="'+datos[3].innerHTML+'"><br>'+
	'<label>Correo Electronico</label>'+
	'<input class="mdl-textfield__input" type="text" value="'+datos[4].innerHTML+'"><br>'+
	'<label>Tipo Cliente</label>'+
	'<select class="mdl-textfield__input" value="'+datos[5].innerHTML+'">'+
		'<option>Ocasional</option>'+
		'<option>Premium</option>'+
	'</select><br>'+
	'<label>Porcentaje Descuento</label>'+
	'<select class="mdl-textfield__input" value="'+datos[6].innerHTML+'">'+
	'<option value="0">0</option>'+
	'<option value="5">5</option>'+
	'</select>'+
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
		    	swal({
			  	title: '¿Seguro que desea modificar los datos del cliente?',
			  	type: 'warning',
			  	showCancelButton: true,
			  	confirmButtonText: 'Si',
			  	cancelButtonText:'No'

			},
			function(isConfirm) {
			  	if (isConfirm) {
			    	location.reload(); 
			  	}
			}); 
		  	}
		});
}

//funcion pensada como funcion para el modulo de clientes el cual muestra un formulario en un modal
//para borrar los datos de un cliente
FuncionesCliente["deleteClient"] = function() {

	var divpadre = this.parentNode
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
			elements[i].addEventListener("keypress",Funciones["NumeroEntero"])
			elements[i].addEventListener("keyup",Funciones["NumeroEntero"])
		};
		var solodecimal = elements[i].getAttribute("solodecimal") || false;
		if (solodecimal) {
			elements[i].addEventListener("keypress",Funciones["NumDecimal"])
			elements[i].addEventListener("keyup",Funciones["NumDecimal"])
		};
		var soloLetras = elements[i].getAttribute("soloLetras") || false;
		if (soloLetras) {
			elements[i].addEventListener("keypress",Funciones["soloLetras"])
			elements[i].addEventListener("keyup",Funciones["soloLetras"])
		};
		var EnterNext = elements[i].getAttribute("EnterNext") || false;
		if (EnterNext) {elements[i].addEventListener("keyup",Funciones["EnterNext"])};

		if ( atributo && Funciones[atributo] ){
			var evento = elements[i].getAttribute("event") || false;
			//modificacion del codigo para poder agregar más de 1 evento a las funciones
			if (evento) {
				var arrayEvent = evento.split(",")
				if (arrayEvent.length > 1) {
					for (var i = 0; i < arrayEvent.length; i++) {
						elements[i].addEventListener(arrayEvent[i],Funciones[atributo]);
					};
				}
				else{
					elements[i].addEventListener(evento,Funciones[atributo]);
				}
			}
			elements[i].addEventListener("change",Funciones[atributo]);
			/*elements[i].addEventListener("paste", function (e) {
				e.preventDefault();
				return false;
			});*/
		}
	}
}


//inicializa la funcion que recorre el html en busca de los elementos con los atributos explicados
FuncionesCliente.init();