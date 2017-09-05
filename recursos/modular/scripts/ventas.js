var cedula = document.getElementById('cedula');
var cliente = document.getElementById('cliente');
var descripcion = document.getElementById('descripcion');
var codigo = document.getElementById('codigo');
var cantidad = document.getElementById('cantidad');
var precio = document.getElementById('precio');
var subtotal = 0, ultimototal = 0, suma = 0, existenciaProductoActual = 0
totalObtenido = 0, calculoDesc = 0, hayDescuento = false, hayCliente = false, nuevaCantidad = 0, cantidadFinal = 0,
	tipoInsercion = 'Agregar', productoEncontrado = false, clienteEncontrado = false

window.onload = () => {
	var date = new Date();
	var labelFecha = document.getElementById('fecha');
	dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear();//Obtener día, mes y año
	labelFecha.innerHTML = "Fecha de la Venta: " + dia + "/" + mes + "/" + anio;//Envio de la fecha al body
}

boton = document.getElementById('btn-agregar').addEventListener('click', agregarProducto);//Al presionar agregar items
datos = { productos: [] }//Creacion de Objeto para guardar los productos de la venta
enviarContenido = document.getElementById('tablaProductos');//Referencia a la tabla donde se envia el contenido


/////////////////////////////////////////Agregar Productos///////////////////////////////////////
function agregarProducto() {
	var superaExistencia = false
	if (productoEncontrado) {//Si existe el producto se procede a validar la existencia
		if (controlarExistencia(cantidad.value, existenciaProductoActual)) {
			swal({
				type: 'error',
				title: 'Incorrecto',
				text: 'Cantidad ingresada es mayor a existencia del producto. Total de '
				+ descripcion.value + ' en existencia: ' + existenciaProductoActual,
				showCancelButton: false,
				confirmButtonText: 'Ok',
				cancelButtonText: 'No',
				closeOnConfirm: true
			})
		} else {
			var cont = 0
			if (cantidad.value == "") {//Si no se ingresa cantidad por defecto será 1
				cantidadFinal = 1
			} else {
				cantidadFinal = cantidad.value//Cantidad será el valor ingresado pero se procede a comprobar si el producto ya se escogio	
			}
			for (var data in datos.productos) {// Recorre todos los codigos de productos para comprobar si se repite
				var aComparar = datos.productos[data].codigo
				cont += 1
				if (codigo.value == aComparar) {//Compara si existe
					if (tipoInsercion == 'Agregar') {//Si va a agregar y ya existe se suma la cantidad a la anterior
						var cant = parseInt(cantidadFinal) + parseInt(datos.productos[data].cantidad)
						if (cant > datos.productos[data].existencia) {//Antes comprueba la existencia
							swal({
								type: 'error',
								title: 'Incorrecto',
								text: 'Cantidad ingresada es mayor a existencia del producto. Total de '
								+ descripcion.value + ' en existencia: ' + datos.productos[data].existencia,
								showCancelButton: false,
								confirmButtonText: 'Ok',
								cancelButtonText: 'No',
								closeOnConfirm: true
							})
							superaExistencia = true
						} else {
							cantidadFinal = parseInt(cantidadFinal) + parseInt(datos.productos[data].cantidad)
						}
					} else if (tipoInsercion == 'Modificar') {//Si se va a modificar uno que ya existe
						cantidadFinal = cantidad.value
						document.getElementById('guardar-actualizar').innerHTML = "Agregar Producto"
					}
					if (!superaExistencia) {
						datos.productos.splice(cont - 1, 1)//a partir de x borrar n cantidad de elemento(s)
						tipoInsercion = 'Agregar'
					}
				}
			}

			/////////////////////////////
			if (!superaExistencia) {//Si no supera la existencia
				price = (precio.value).replace(",", ".")//Cambio de coma a punto
				totalpagar1 = parseFloat(parseFloat(price) * parseInt(cantidadFinal))//CAlculo de total a pagar
				var totalpagar2 = String(totalpagar1).replace(".", ",")//Volver a dejar la coma
				id = "prod_" + Math.floor(Math.random() * 10000)//Identificador aleatorio para el registro
				datos.productos.push(//Insercion de datos al objeto
					{
						id: id, codigo: codigo.value, descripcion: descripcion.value, precio: precio.value,
						cantidad: cantidadFinal, totalAPagar: totalpagar2, existencia: existenciaProductoActual
					}
				);
				actualizarTabla();//Una vez insertados actualiza la tabla
				codigo.value = "", descripcion.value = "", precio.value = "", cantidad.value = ""
				productoEncontrado = false
			}
		}

	} else {
		swal({
			type: 'error',
			title: 'Datos incompletos',
			text: 'Debe buscar un producto',
			showCancelButton: false,
			confirmButtonText: 'Ok',
			cancelButtonText: 'No',
			closeOnConfirm: true
		})
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////
function modificarProducto(identificador) {// identificador 1, 2, 3, 4, etc
	var cont = 0
	for (var data in datos.productos) {// Recorre todos los codigos de productos para comprobar si se repite
		var aComparar = datos.productos[data].codigo
		cont += 1
		if (identificador == cont) {
			codigo.value = datos.productos[data].codigo
			codigoGuardado = datos.productos[data].codigo
			descripcion.value = datos.productos[data].descripcion
			precio.value = datos.productos[data].precio
			cantidad.value = datos.productos[data].cantidad
			productoEncontrado = true
			//alert(datos.productos[data].existencia)
			existenciaProductoActual = datos.productos[data].existencia
			tipoInsercion = 'Modificar'
			document.getElementById('guardar-actualizar').innerHTML = "Actualizar"
			break
		}
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function eliminarProducto(identificador) {// identificador 1, 2, 3, 4, etc
	swal({
		title: 'Quitar Producto',
		text: '¿Desea quitar este producto?',
		showCancelButton: true,
		confirmButtonText: 'Si',
		cancelButtonText: 'No',
		closeOnConfirm: true
	}, function (isConfirm) {
		if (isConfirm) {
			datos.productos.splice(identificador - 1, 1)//a partir de x borrar n cantidad de elemento(s)
			actualizarTabla()//Despues de eliminar elementos actualiza la tabla
		}
	});
}
/////////////////////////////Actualizar tabla de productos//////////////////////////////////////
function actualizarTabla() {
	//totalObtenido = 0
	total = 0, IVA = 12, calculoIVA = 0//Puede cambiar valor de IVA de 12
	var descuento = 5
	//	calculoDesc = 0;//En este caso esta establecido de 5%
	tablaGernerada = ''
	subtotal = 0///////////////////////
	console.log(JSON.stringify(datos.productos))
	for (var data in datos.productos) {
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td>'
		tablaGernerada += '<td><button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="modificarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#3F9735"class="zmdi zmdi-edit"></i></button>    '
		tablaGernerada += '<button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="eliminarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#B71C1C"class="zmdi zmdi-close-circle"></i></button></td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")
		//console.log(totalObtenido)
		subtotal += parseFloat(totalObtenido)
	}
	calculoIVA = (subtotal * IVA) / 100
	if (!hayDescuento) {
		calculoDesc = 0
	} else {
		calculoDesc = (subtotal * descuento) / 100
	}
	total = subtotal + calculoIVA - calculoDesc

	////////////////////////Cambio de . por la ,  a los datos mostrados en tabla////////////////////////////
	var subtotal2 = String(subtotal).replace(".", ","), calculoIVA2 = String(calculoIVA).replace(".", ","),
		calculoDesc2 = String(calculoDesc).replace(".", ","), total2 = String(total).replace(".", ",")
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	tablaGernerada += '<tr><td></td><td></td><td></td><td></td>'
	tablaGernerada += '<td><b><h6>Subtotal : </h6></b><b><h6>IVA : </h6></b><b><h6>Descuento : </h6></b>'
	tablaGernerada += '<b><h6>Total : </h6></b>'
	tablaGernerada += '<td><b><h6>$ ' + subtotal2 + '</h6></b><b><h6>$ ' + calculoIVA2 + '</h6></b><b><h6>$ ' + calculoDesc2 + '</h6></b>'
	tablaGernerada += '<b><h6>$ ' + total2 + '</h6></b>'
	tablaGernerada += '<td><center><button id="btn-imprimir" onclick="printDiv()" title="Imprimir Factura"'
		+ 'class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: #3F51B5;"'
		+ 'ocultarID="divTabla" mostrarID="tabNewAdmin">IMPRIMIR FACTURA</button></center></td></td></tr>'
	enviarContenido.innerHTML = tablaGernerada
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}

function cambioCedula() {
	document.getElementById("cliente").value = ""
}
function validarCliente() {
	alert("Debe ingresar los datos del cliente")
}
////////////////////////////////////////////////////////////////////////////////////////////////
var BuscarCliente = document.getElementById('btnBuscarCliente')
BuscarCliente.addEventListener('click', () => {
	descuento = 0
	var cedula = document.getElementById('cedula').value;
	if (cedula.length > 0) {
		$.ajax({ type: "GET", url: "/admin/buscar/" + cedula, dataType: "json", contentType: "text/plain" }).done((datos) => {
			if (datos.cliente.length) {
				cliente.value = ""
				swal({
					type: "error",
					title: 'No se encontró',
					text: 'Busque un cliente que esté registrado',
					confirmButtonText: 'Ok',
					closeOnConfirm: true
				})
				clienteEncontrado = false
			} else {
				console.log(datos)
				cliente.value = datos.cliente.Nomb_Cli
				hayCliente = true
				tipoCliente = datos.cliente.Tip_Cli
				clienteEncontrado = true
				if (tipoCliente == 'Ocasional') {
					hayDescuento = false
				} else if (tipoCliente == 'Premium') {
					hayDescuento = true
				}
			}
		});
	} else {
		swal({
			type: "error",
			title: 'Datos incompletos',
			text: 'Especifique la cédula del cliente',
			confirmButtonText: 'Ok',
			closeOnConfirm: true
		})
		clienteEncontrado = false
	}

});
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var BuscarProducto = document.getElementById('btnBuscarProducto')
BuscarProducto.addEventListener('click', () => {
	var codigo = document.getElementById('codigo').value;
	if (codigo.length > 0) {
		$.ajax({ type: "GET", url: "/admin/buscarprod/" + codigo, dataType: "json", contentType: "text/plain" }).done((datosProd) => {
			if (datosProd.producto.length) {
				descripcion.value = ""
				swal({
					type: "error",
					title: 'No se encontró',
					text: 'Busque un producto que este registrado',
					confirmButtonText: 'Ok',
					closeOnConfirm: true
				})
				productoEncontrado = false
			} else {
				descripcion.value = datosProd.producto.Des_Prod
				precio.value = datosProd.producto.PrecVen_Pro
				existenciaProductoActual = datosProd.producto.Exis_Prod
				console.log(existenciaProductoActual)
				productoEncontrado = true
				console.log(datosProd.producto)
			}
		});
	} else {
		swal({
			type: "error",
			title: 'Datos incompletos',
			text: 'Especifique el código del producto',
			confirmButtonText: 'Ok',
			closeOnConfirm: true
		})
		productoEncontrado = false
	}

});

function printDiv() {
	swal({
		title: 'Guardar e Imprimir Factura',
		text: '¿Está seguro de guardar los cambios?',
		showCancelButton: true,
		confirmButtonText: 'Si, Guardar e Imprimir',
		cancelButtonText: 'Cancelar',
		closeOnConfirm: true
	}, function (isConfirm) {
		if (isConfirm) {
			var date = new Date();
			var dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear();//Obtener día, mes y año
			var fecha = dia + "/" + mes + "/" + anio;
			var valor = 0
			tablaImprimir()
			document.getElementById("paraImprimir").style.display = "block"
			document.getElementById('titulo').innerHTML = "Car de Lujo"
			document.getElementById('subtitulo').innerHTML = "Factura N°  "
			document.getElementById('fechaimp').innerHTML = fecha
			document.getElementById('cedulaimp').innerHTML = "Cédula del Cliente: " + cedula.value
			document.getElementById('clienteimp').innerHTML = "Nombre del Cliente: " + cliente.value
			if (hayDescuento) {
				valor = 5
			} else {
				valor = 0
			}
			document.getElementById('descuentoimp').innerHTML = "Descuento: " + valor + "%"

			//--------------------------------------------------------------------------------------------------
			var contenido = document.getElementById("paraImprimir").innerHTML
			var contenidoOriginal = document.body.innerHTML
			document.body.innerHTML = contenido
			setTimeout(() => { window.print(); window.location = "ventas"; }, 200)
			datos={"Ced_Vent":cedula.value,"NomCli_Vent":cliente.value,"CodPro_Vent":datos.productos,"Desc_Vent": calculoDesc, "Total_Vent":parseFloat(total)};
			$.ajax({
				type:"POST",
				url:"/admin/ventas/",
				dataType:"text",
				contentType:"application/json",
				data: JSON.stringify(datos)
			}).done(function(msg){
				swal({
					type: "success",
					title: 'Información',
					text: msg,
					confirmButtonText: 'Ok',
					closeOnConfirm: true
				}, function(isConfirm){
					var date = new Date();
					var dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear();//Obtener día, mes y año
					var fecha = dia + "/" + mes + "/" + anio;
					var valor = 0
					tablaImprimir()
					document.getElementById("paraImprimir").style.display = "block"
					document.getElementById('titulo').innerHTML = "Car de Lujo"
					document.getElementById('subtitulo').innerHTML = "Factura N°  "
					document.getElementById('fechaimp').innerHTML = fecha
					document.getElementById('cedulaimp').innerHTML = "Cédula del Cliente: " + cedula.value
					document.getElementById('clienteimp').innerHTML = "Nombre del Cliente: " + cliente.value
					if (hayDescuento) {
						valor = 5
					} else {
						valor = 0
					}
					document.getElementById('descuentoimp').innerHTML = "Descuento: " + valor + "%"
		
					//--------------------------------------------------------------------------------------------------
					var contenido = document.getElementById("paraImprimir").innerHTML
					var contenidoOriginal = document.body.innerHTML
					document.body.innerHTML = contenido
					setTimeout(() => { window.print(); window.location = "ventas"; }, 200)
					
				})
			}); 
		}
	});
	//--------------------------------------------------------------------------------------------------
}

function tablaImprimir() {
	//totalObtenido = 0
	total = 0, IVA = 12, calculoIVA = 0//Puede cambiar valor de IVA de 12
	var descuento = 5
	//	calculoDesc = 0;//En este caso esta establecido de 5%
	tablaGernerada = ''
	subtotal = 0///////////////////////
	console.log(JSON.stringify(datos.productos))
	for (var data in datos.productos) {
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")
		console.log(totalObtenido)
		subtotal += parseFloat(totalObtenido)
	}
	calculoIVA = (subtotal * IVA) / 100
	if (!hayDescuento) {
		calculoDesc = 0
	} else {
		calculoDesc = (subtotal * descuento) / 100
	}
	total = subtotal + calculoIVA - calculoDesc

	////////////////////////Cambio de . por la ,  a los datos mostrados en tabla////////////////////////////
	var subtotal2 = String(subtotal).replace(".", ","), calculoIVA2 = String(calculoIVA).replace(".", ","),
		calculoDesc2 = String(calculoDesc).replace(".", ","), total2 = String(total).replace(".", ",")
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	tablaGernerada += '<tr><td></td><td></td><td></td><td></td>'
	tablaGernerada += '<td><b><h6>Subtotal : </h6></b><b><h6>IVA : </h6></b><b><h6>Descuento : </h6></b>'
	tablaGernerada += '<b><h6>Total : </h6></b>'
	tablaGernerada += '<td><b><h6>$ ' + subtotal2 + '</h6></b><b><h6>$ ' + calculoIVA2 + '</h6></b><b><h6>$ ' + calculoDesc2 + '</h6></b>'
	tablaGernerada += '<b><h6>$ ' + total2 + '</h6></b></td>'
	tablaGernerada += '</tr>'
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}


function controlarExistencia(cantidad, existencia) {
	if (cantidad > existencia) {
		return true
	} else {
		return false
	}
}
