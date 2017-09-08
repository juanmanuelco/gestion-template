/// este script se basó en el siguiente documento
// http://www.sri.gob.ec/DocumentosAlfrescoPortlet/descargar/11a5917c-ea28-46f8-bb19-3737bf6cd07b/Estructura+del+RUC.doc
//script de validacion de cedula y ruc segun el SRI

ident={};
nProvincia = 24;

ident["validarCedula"] = function (cedula) {
	//comprrobamos la longitud del campo de cedula si es diferente a 10 la funcion se cancela
	//devolviendo el valor false
	if (cedula.length != 10  ) { return false;};
	//se comprueba que los 2 primeros digitos corresponda a alguna  provincia del país
	if (!validarCodProv(cedula.substr(0, 2))) {return false;};
	//se valida el tipo de ruc ya que es lo mismo en este caso en personas naturales
	if (!tipoRuc(cedula[2])) {return false;};
	//validamos la segula segun el modulo10
	if (!validarCedula(cedula)) {return false;};
	return true;
}

ident["validarRuc"] = function (ruc){
	//comprobamos la longitud del ruc
	if (ruc.length !=13 && ruc.length!=14 ) { return false;};
	//se comprueba que los 2 primeros digitos corresponda a alguna  provincia del país
	if (!validarCodProv(ruc.substr(0, 2))) {return false;};
	//se valida el tipo de ruc
	if (!tipoRuc(ruc[2])) {return false;};
	//validamos los ultimos digitos para verificar el codigo de establecimiento
	if (!codigoEstablecimiento(ruc.substr(10, 3))) {return false;};
	//validamos el ruc por modulo 11
	if (!validarRuc(ruc)) {return false};
	return true;
}


// se valida el numero de cedula por el algoritmo de modulo 10 (https://es.wikipedia.org/wiki/C%C3%B3digo_de_control)
var validarCedula = function(num){
	var calc, i, check, checksum = 0, r = [2,1]; 
	for( i=num.length-1; i--; ){
		calc = num.charAt(i) * r[i % r.length];
		calc = ((calc/10)|0) + (calc % 10);
		checksum += calc;
	}
	check = (10-(checksum % 10)) % 10;
	checkDigit = num % 10;
	if (check == 0) {checkDigit=0};
	return check == checkDigit;
}

//se valida la provincia del ruc o cedula que va desde  1 hasta nProvincia
var validarCodProv = function (num) {
	num = parseInt(num);
	if (num <= 0 || num > nProvincia) {
        return false;
    }
    return true;
}

//se valida el tipo de ruc segun el tercer digito
var tipoRuc = function(tercerDigito){
	tercerDigito = parseInt(tercerDigito);
	if (tercerDigito >= 0 && tercerDigito < 6) {
		//si el tercer digito del ruc es mayor o igual a 0 y menor a 6 entonces es un ruc persona natural
		return true;
	}
	else{
		if (tercerDigito==9) {
			//si el tercer digito es 9 entonces el ruc es privado
			return true;
		}
		else{
			if (tercerDigito==6) {
				//si el tercer digito es 9 entonces el ruc es publico
				return true;
			}
		}
	}
	//si nada se cumple el ruc no es valido
	return false;
}

//se valida el codigo de establecimiento
var codigoEstablecimiento = function (num){
	num = parseInt(num);
	if (num<1) {return false};
	return true;
}

//validacion de run segun el agoritmo de modulo 11 con los coeficientes dados
var validarRuc = function (numero) {
	var veri = 0;
	//array = coeficientes a comparar
	var array;
	if (numero[2] == 9){
		array = [4, 3, 2, 7, 6, 5, 4, 3, 2];
		max = 9;
		veri = parseInt(numero[9]);
	}
	else{
		if (numero[2] == 6) {
			array = [3, 2, 7, 6, 5, 4, 3, 2];
			max = 8;
			veri = parseInt(numero[8]);
		}
		else{
			if (numero[2] >= 0 && numero[2] < 6) {
				return validarCedula(numero.substr(0, 10));
			}
		}
	}
    var suma =0, cadena =0, residuo = 0;
    for (var i = 0; i < max; i++) {
    	cadena = parseInt(numero.charAt(i))*(array[i]||0);
    	suma +=  parseInt(cadena);
    };
    residuo = 11 - (suma%11);
    if (residuo == 0) {veri = 0};
    if (residuo!=veri) {return false;};
    return true;
}