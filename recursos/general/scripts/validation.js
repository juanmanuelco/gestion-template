/*
	Este script se ha construido para poder realizar funciones "globales" (en lo posible)
	en las cuales hallaremos validaciones echas para elementos html
	la forma de llamar estas funciones es simple, en el objeto html deberemos poner las siguientes
	etiquetas validation="nombre de funcion",event="nombre del evento con el cual se activara la funcion" 
	y otros atributos dependiendo las funciones ejemplo:
	input validacion cedula y ruc
	<input type="number" validation="cedruc" event="keyup">
	input validacion cedula 
	<input type="number" validation="cedula" event="keyup">
	input validacion ruc
	<input type="number" validation="ruc" event="keyup">
	busqueda de tablas con datos estaticos
	en este caso tabla ID es el id de la tabla donde se realizara la busqueda y datos son las columnas en las cuales 
	interacuta la busqueda
	<input type="text" class="search" validation="buscarTabla" event="keyup" TablaID="tablaProducts" datos="0,1,2">
	cada funcion tendrá un comentario para saber con que elementos han sido pensadas

	PD: a los que metan funciones nuevas aqui, sea para uso de modulo o que estén pensadas para todos, por favor,
	comentar las funciones así como lo he echo yo, para saber con que se puede usar y con que eventos

	PD2: las funciones echas para verificacion de cedula y ruc están con funciones de identificacion.js
	por lo cual se debe llamar a ese script antes de este si se van a usar estas validaciones
*/

Funciones = {};

Timers={};

spansTextBefore={}
//funcion cedruc pensada para usarla con inputs y con los eventos keyup, keypress
Funciones["cedruc"] = function (e) {
	var ekey="";
	if (e && e.key && (e.type=="change" || e.key == "e") ) { ekey=(e.key||"") };
	var span = this.parentNode.getElementsByTagName("span")[0]
	var cedula = this.value+""+ekey;
	if (cedula == "") {this.parentNode.classList.remove("is-invalid"); return false;};
	spansTextBefore[span] = span.innerHTML;
	span.innerHTML="Cédula/Ruc no válida/o";
	if (Timers[this.name]) {
		clearTimeout(Timers[this.name]);
	};
	if (!ident.validarCedula(cedula) && !ident.validarRuc(cedula)) {
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.add("is-invalid");
		},200,this);
	}
	else{
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.remove("is-invalid");
		},200,this);
	}
}


//funcion cedula pensada para usarla con inputs y con los eventos keyup, keypress
Funciones["cedula"] = function (e) {
	var ekey="";
	if (e && e.key && (e.type=="change" || e.key == "e") ) { ekey=(e.key||"") };
	var span = this.parentNode.getElementsByTagName("span")[0]
	var cedula = this.value+""+ekey;
	if (cedula == "") {this.parentNode.classList.remove("is-invalid"); return false;};
	spansTextBefore[span] = span.innerHTML;
	span.innerHTML= "Cédula no válida";
	if (Timers[this.name]) {
	clearTimeout(Timers[this.name])
	}
	if (!ident.validarCedula(cedula)) {
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.add("is-invalid");
		},1,this);
	}
	else{
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.remove("is-invalid");
		},200,this);
	}
}


//funcion cedula pensada para usarla con inputs y con los eventos keyup, keypress
Funciones["ruc"] = function (e) {
	var ekey="";
	if (e && e.key && (e.type=="change" || e.key == "e") ) { ekey=(e.key||"") };
	var span = this.parentNode.getElementsByTagName("span")[0]
	var ruc = this.value+""+ekey;
	if (ruc == "") {this.parentNode.classList.remove("is-invalid"); return false;};
	spansTextBefore[span] = span.innerHTML;
	span.innerHTML= "Ruc no válido";
	if (Timers[this.name]) {
	clearTimeout(Timers[this.name]);};
	if (!ident.validarRuc(ruc)) {
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.add("is-invalid");
		},200,this);
	}
	else{
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.remove("is-invalid");
		},200,this);
	}
}

//funcion cedula pensada para usarla con inputs y con los eventos keyup, keypress
Funciones["email"] = function(e){	
	var ekey="";
	if (e && e.key && e.type=="change") { ekey=(e.key||"") };
	if (this.value+""+ekey =="") {this.parentNode.classList.remove("is-invalid"); return false;};
	var patt = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var res = patt.test(this.value+""+ekey);
	if (Timers[this.name]) {
	clearTimeout(Timers[this.name]);};
	if (!res) {
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.add("is-invalid");
		},200,this);
	}
	else{
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.remove("is-invalid");
		},200,this);
	}
}

//funcion inicializacion pensada para poder ser llamada en el caso de que se genere nuevos elementos html 
//desde javascript
Funciones["init"] = function (argument) {
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
			elements[i].addEventListener("blur",Funciones["soloLetras"])
		};
		var EnterNext = elements[i].getAttribute("EnterNext") || false;
		if (EnterNext) {elements[i].addEventListener("keyup",Funciones["EnterNext"])};

		if ( atributo && Funciones[atributo] ){
			var evento = elements[i].getAttribute("event") || false;
			//modificacion del codigo para poder agregar más de 1 evento a las funciones
			if (evento) {
				var arrayEvent = evento.split(",")
				if (arrayEvent.length > 1) {
					for (var a = 0; a < arrayEvent.length; a++) {
						elements[i].addEventListener(arrayEvent[a],Funciones[atributo]);
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

//funcion ocultar mostrar pensada para usarla con cualquier elemento usando el metodo click 
//la funcion oculta elementos con el atributo ocultarID="id1,id2,...,idn" para ocultar secciones enteras
// y la funcion mostrarID="id1,id2,id3,...,idn" hace lo mismo para mostrar secciones
Funciones["ocultarmostrar"] = function (e) {
	e.preventDefault();
	var mostrarID = this.getAttribute("mostrarID")||false;
	if (mostrarID) {
	var arrayMID = mostrarID.split(",")
		if (arrayMID.length > 1) {
			for (var i = 0; i < arrayMID.length; i++) {
				document.getElementById(arrayMID[i]).style.display="block";
			};
		}
		else{
			document.getElementById(mostrarID).style.display="block";
		}
	}

	var ocultarID = this.getAttribute("ocultarID")||false;
	if (ocultarID) {
		var ocultarMID = ocultarID.split(",")
		if (ocultarMID.length>1) {
			for (var i = 0; i < ocultarMID.length; i++) {
				document.getElementById(ocultarMID[i]).style.display="none";
			};
		}
		else{
			document.getElementById(ocultarID).style.display="none"
		}
	};
}

/*funcion pensada para ser usada con un input y unicamente con la funcion keyup para poder hacer
busqueda dinamica en una tabla estatica sin conexion a base de datos, que se busca en el atributo 
TablaID="id" o por defecto buscara una tablacon la id "table", con el atributo datos="0,1,2,...,n"
definimos las columnas en el que la busqueda tendrá efecto por defecto busca en las columnas 0,1,5
por que fue pensada para el modulo de cliente y despues se hizo pensando en los demás
*/
Funciones["buscarTabla"] = function (e) {
	var id = this.getAttribute("TablaID") || "table"
	var tabla = document.getElementById(id);
	if(!tabla){console.log("no se encontró la tabla referida"); return false};
	var array = [0,1,5]
	if (this.getAttribute("datos")) {
		array = this.getAttribute("datos").split(",")
	};
    var busqueda = this.value;
    busqueda = busqueda.toLowerCase()
    var cellsOfRow="";
    var found=false;
    var compareWith="";
    busqueda = busqueda.trim(busqueda)
    if (busqueda.trim()=="") {
    	for (var i = 1; i < tabla.rows.length; i++) {
            tabla.rows[i].style.display = '';
   		 }
    	return false;
    };

    for (var i = 1; i < tabla.rows.length; i++) {
        cellsOfRow = tabla.rows[i].getElementsByTagName('td');
        found = false;
        for (var j = 0; j < cellsOfRow.length; j++)
        {
        	if (dataTable(j,array)) {
                compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                if (busqueda.length == 0 || (compareWith.indexOf(busqueda) > -1))
                {
                    found = true;
                }
            };
        }
        if(found)
        {
            tabla.rows[i].style.display = '';
        } else {
            tabla.rows[i].style.display = 'none';
        }
    }
}

//funcion que forma parte de la funcion anterior para buscar los datos segun su id de columna
function dataTable(j,array){
	for (var i = 0; i < array.length; i++) {
		if (j==array[i]) {return true;};
	};
	return false;
}
//funcion echa por paz para permitir decimales en inputs unicamente con coma (,) y 2 decimales maximo 
//esta se usa unicamente con el evento keypress aunqueda algo que validar no recuerdo bien que era

Funciones["NumDecimal"] = function(e){
	var key = window.Event ? e.which : e.keyCode
    if((key >= 48 && key <= 57) || (key==44) || (e.type=="keyup")) {
		var ekey=String.fromCharCode(key)|| "";
		if(key==44){ekey=","}
		if (e.type=="keyup") {ekey=""};
		var numero = this.value + "" + ekey;
		var span = this.parentNode.getElementsByTagName("span")[0]
		if (Timers[this.name]) {
			clearTimeout(Timers[this.name]);}
		;
		if(validarnum(numero,span)){
			Timers[this.name] = setTimeout(function (a){
				a.parentNode.classList.remove("is-invalid");
			},1,this);
		}
		else{
			Timers[this.name] = setTimeout(function (a){
				a.parentNode.classList.add("is-invalid");
			},1,this);
		}
        return true;
    }
    else{
		e.preventDefault();
        return false;
    }
}

//esta funcion al parecer hace lo mismo que la anterior permitiendo unicamente numeros enteros
//tambien pensada para usarse con event="keypress"
Funciones["NumeroEntero"] = function(e){
	var key = window.Event ? e.which : e.keyCode
    if((key >= 48 && key <= 57) || (e.type=="keyup")){
		var ekey=String.fromCharCode(key)|| "";
		if (e.type=="keyup") {ekey=""};
		
		var numero = this.value + "" + ekey;
		var span = this.parentNode.getElementsByTagName("span")[0]
		if (Timers[this.name]) {
			clearTimeout(Timers[this.name]);}
		;
		if(validarnum(numero,span)){
			Timers[this.name] = setTimeout(function (a){
				a.parentNode.classList.remove("is-invalid");
			},1,this);
		}
		else{
			Timers[this.name] = setTimeout(function (a){
				a.parentNode.classList.add("is-invalid");
			},1,this);
		}
        return true;
    }
    else{
		e.preventDefault();
        return false;
    }
}

//funcion para validar solo numeros con decimales
function validarnum(numero,span){
    numero = numero.replace(",", ".")
    if (!isNaN(numero)){
        var array = numero.split(".")
            if(array[1] && array[1].length > 2){
                if(span){
                    span.innerHTML="Sólo se aceptan 2 decimales";
                }
                return false;
            }
        return true;
    }
    if (span) {
        span.innerHTML="Ingrese sólo valores numéricos";
    };
    return false
}


//Funcion para pasar al siguiente elemento dando enter
Funciones["EnterNext"] = function (e) {
	(e.keyCode)?k=e.keyCode:k=e.which;
	if(k==13)
	{	
		var idnext = this.getAttribute("idNext")||false;
		if (idnext) {
			var element = document.getElementById(idnext) || false;
			if (element) {element.focus()};
		};
		e.preventDefault();
	}
}

Funciones["soloLetras"] = function (e) {
	patron =/[A-Za-zñáéíóúÁÉÍÓÚ\s]/;
	var validacion=true;
	this.parentNode.classList.remove("is-invalid")
	if (e.type == "keypress") {
		tecla = (document.all) ? e.keyCode : e.which;
		text = String.fromCharCode(tecla);
		validacion = patron.test(text);
		//if (!validacion) {e.preventDefault()};
	}
	else{
		if (e.type=="keyup" || e.type=="blur") {
			if (this.value.length>=1) {
				for (var i = 0; i < this.value.length; i++) {
					validacion = patron.test(this.value[i]);
					if (!validacion) {break;};
				};
			};
		}
	}
	if (Timers[this.name]) {
		clearTimeout(Timers[this.name])
	}
	if(!validacion){
		Timers[this.name] = setTimeout(function (a){
			a.parentNode.classList.add("is-invalid");
		},1,this);
	}

	this.addEventListener("focus", function (argument) {
		this.parentNode.classList.remove("is-invalid")
	});
}

//inicializa la funcion que recorre el html en busca de los elementos con los atributos explicados
Funciones.init();