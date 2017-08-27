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
		var codigo = document.getElementById('codigo').value;
		descripcion = document.getElementById('descripcion').value;
		cantidad = document.getElementById('cantidad').value;
		precio = document.getElementById('precio').value;
		totalAPagar = parseFloat(parseFloat(precio) * parseInt(cantidad));
		id = "prod_" + Math.floor(Math.random() * 10000);//Identificador aleatorio para el registro
		if (codigo.length > 0) {//pequeña validacion de prueba
			datos.productos.push(//Insercion de datos al objeto
				{ id: id, codigo: codigo, descripcion: descripcion, precio: precio, cantidad: cantidad, totalAPagar: totalAPagar }
			);
			actualizarTabla();//Una vez insertados actualiza la tabla
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////

	function eliminarProducto(identificador) {//Ejemplo 1
		swal({
			title: 'Quitar Producto',
			text: '¿Desea quitar este producto?',
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'No',
			closeOnConfirm: true
		},
			function (isConfirm) {
				if (isConfirm) {
					datos.productos.splice(identificador - 1, 1);//a partir de x borrar n cantidad de elemento(s)
					actualizarTabla();//Despues de eliminar elementos actualiza la tabla
				}
			});
	}

	/////////////////////////////Actualizar tabla de productos//////////////////////////////////////
	function actualizarTabla() {
		subtotal = 0, total = 0, IVA = 12, calculoIVA = 0;//Puede cambiar valor de IVA de 12
		descuento = 5, calculoDesc = 0;//En este caso esta establecido de 5%
		tablaGernerada = '';
		//all = JSON.stringify(datos)
		for (var data in datos.productos) {
			tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
			tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
			tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td>'
			tablaGernerada += '<td><button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="eliminarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#B71C1C"class="zmdi zmdi-close-circle"></i></button></td></tr>'
			subtotal += totalAPagar;
		}
		//Calculo de iva, descuento y totales de acuerdo a los datos ingresados
		calculoIVA = (subtotal * IVA) / 100;
		calculoDesc = (subtotal * descuento) / 100;
		total = subtotal + calculoIVA - calculoDesc;

		tablaGernerada += '<tr><td></td><td></td><td></td><td></td>'
		tablaGernerada += '<td><b><h6>Subtotal : </h6></b><b><h6>IVA : </h6></b><b><h6>Descuento : </h6></b>'
		tablaGernerada += '<b><h6>Total : </h6></b>'
		tablaGernerada += '<td><b><h6>$ ' + subtotal + '</h6></b><b><h6>$ ' + calculoIVA + '</h6></b><b><h6>$ ' + calculoDesc + '</h6></b>'
		tablaGernerada += '<b><h6>$ ' + total + '</h6></b>'
		tablaGernerada += '<td><center><button id="btn-imprimir" title="Imprimir Factura"'
			+ 'class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: #3F51B5;"validation="ocultarmostrar"'
			+ 'ocultarID="divTabla" mostrarID="tabNewAdmin" event="click">IMPRIMIR FACTURA</button></center></td></td></tr>'
		enviarContenido.innerHTML = tablaGernerada;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	var BuscarCliente = document.getElementById('btnBuscarCliente');
	BuscarCliente.addEventListener('click', () => {
		var cedula = document.getElementById('cedula').value;
		$.ajax({ type: "GET", url: "/admin/buscar/" + cedula, dataType: "json", contentType: "text/plain" }).done((datos) => {
			console.log(datos);
		});
	});
	/////////////////////////////////////////////////////////////////////////////////////////////////
