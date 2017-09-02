FuncionesProducto = {}
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
FuncionesProducto["saveProducto"] = function (e){
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
			  	title: 'Formulario Válido',
			  	type: 'success',
			  	text:"Se guardarán los datos correctamente",
			  	showCancelButton: true,
			  	confirmButtonText: 'Ok',
			  	closeOnConfirm: true
			},
			function(isConfirm) {
			  	if (isConfirm) {
                    form.action = '/admin/crearProducto?Cod_Prod='+form.Cod_Prod.value
			  		form.submit();
			  	}
			  	else{
			  		return false;
			  	}
			});
	}
}

textoAnterior={}
function validarUsuario (input) {
	var divPadre = input.parentNode
	if (divPadre.classList.contains("is-invalid")) {return false;};
	var span = divPadre.getElementsByTagName("span");
	if (span && textoAnterior[input.id] == undefined) {
		textoAnterior[input.id] = span[0].innerHTML;
    };
    var Cod_Prod = input.value
  	$.post("/admin/getProducts",
    {
        Cod_Prod: Cod_Prod,
    },
    function(data,status){
    	if (status == "success") {
            console.log(data)
    		if (data.length >= 1) {
				span[0].innerHTML = "El producto con este código ya está registrado en la base de datos";
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



FuncionesProducto["deleteProduct"] = function () {

        var divpadre = this.parentNode.parentNode;
        var divButton = divpadre.parentNode
        var datos = divButton.parentNode.getElementsByTagName("td")
        var infoHTML = '<form id="deleteForm" action="/admin/eliminarProducto" method="post"><label>Código: '+datos[0].innerHTML+
        '</label><br><label>Descripción: '+datos[1].innerHTML+'</label>';
        infoHTML+='<input type="hidden" name="Cod_Prod" id="Cod_Prod" type="number" value="'+
        datos[0].innerHTML+'" readonly="readonly"><input type="hidden" value="Eliminar" name="accion" id="accion"></form>';
        $.post("/admin/getProducts",
        {
            Cod_Prod: datos[0].innerHTML,
        },
        function(data,status){
            if (status == "success") {
                if (data.length >= 1) {
                    if (data[0].Existencia > 0){
                        swal({
                            title: 'No se puede eliminar este producto, por que aun está en stock',
                            type: 'warning',
                            confirmButtonText: 'Ok',
                            closeOnConfirm: true
                      })
                    }
                    else{
                        swal({
                            title: '¿Seguro que desea eliminar los datos de este Producto?',
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
    
    
    // //modal editar producto
    FuncionesProducto["editProducto"] = function () {
        var divpadre = this.parentNode.parentNode
        var divButton = divpadre.parentNode
        var datos = divButton.parentNode.getElementsByTagName("td")
        var formhtml = '<form id="editForm" style="text-align: left;"  enctype="multipart/form-data" action="/admin/editarProducto?Cod_Prod='+datos[0].innerHTML+'" method="post">'+
        '<div class="mdl-grid">'+
        '<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
            '<label class="text-condensedLight" style="font-size:20px;">Foto del Producto</label>'+
            '<div class="div_file btn">'+
                '<p class="texto">Cambiar imágen (102x102) </p>'+
                '<input type="file" class="btn_enviar mdl-textfield__input" id="file_url" accept=".jpg,.png," name="image_producto" onchange="alertaOferta(this,this.files[0].size)" required/>'+
            '</div>'+
        '</div>'+
        '<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
            '<div id="poder" style="display: block;margin:0 auto; border:solid #000000; height:108px; width:108px;">'+
                '<img style="" src="'+datos[0].id+'" height="102px" width="102px" id="img_destino">'+
            '</div>'+
        '</div>'+
        '</div>'+
        '<span id="msgError" style="display:none;color:#d50000;position:absolute;font-size:14px;margin-top:3px;">Solo se admite fotos de menos de 300kb</span>'+
        '<br>'+
        '<label style="text-align: left;">Código del Producto: </label>'+
        '<input class="mdl-textfield__input"  name="Cod_Prod" id="Ced_Emp" type="number" value="'+datos[0].innerHTML+'" readonly="readonly"><br>'+
        '<label>Descripción</label>'+
        '<input class="mdl-textfield__input"  name="Des_Prod" id="Des_Prod" type="text" value="'+datos[1].innerHTML+'"><br>'+
        '<label>Existencia</label>'+
        '<input class="mdl-textfield__input" name="Exis_Prod" id="Exis_Prod" type="number" value="'+datos[2].innerHTML+'"><br>'+
        '<label>Precio de la compra</label>'+
        '<input class="mdl-textfield__input" name="PrecComp_Pro" id="PrecComp_Pro" type="number" value="'+datos[3].innerHTML+'"><br>'+
        '<label>Precio de la Venta</label>'+
        '<input class="mdl-textfield__input" name="PrecVen_Pro" id="PrecVen_Pro" type="number" value="'+datos[4].innerHTML+'"><br>'+
        '<label id="labelFormModal" style="display:none;color:#d50000;position:absolute;font-size:16px;margin-top:3px;">Por favor asegurese que todos los datos del formulario son correctos </label>'+
        '<input type="hidden" value="Actualizar" name="accion" id="accion">'+
        '</form>'
        swal({
            title: 'Datos Producto',
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
                title: '¿Seguro que desea modificar los datos del Producto?',
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
    FuncionesProducto["infoProductos"] = function (argument) {
        var divpadre = this.parentNode.parentNode
        var divButton = divpadre.parentNode
        var datos = divButton.parentNode.getElementsByTagName("td")
                textHTML='<div id="poder" style="display: block; left: 80%; position: absolute; margin:0 auto">'+
                            '<img style="" src="'+datos[0].id+'" height="102px" width="102px" id="img_destino">'+
                        '</div>'+
                        '<br>'+
                        '<br>'+
                        '<label class="text-condensedLight" style="float:left;font-size:20px;">Código del Producto</label>'+
                        '<input class="mdl-textfield__input" type="text" value="'+datos[0].innerHTML+'" readonly>'+
                        '<br>'+
                        '<label class="text-condensedLight" style="float:left;font-size:20px;">Descripción</label>'+
                        '<input class="mdl-textfield__input" type="text" value="'+datos[1].innerHTML+'" readonly>'+
                        '<br>'+
                        '<label class="text-condensedLight" style="float:left;font-size:20px;">Existencia</label>'+
                        '<input class="mdl-textfield__input" type="text" value="'+datos[2].innerHTML+'" readonly>'+
                        '<br>'+
                        '<label class="text-condensedLight" style="float:left;font-size:20px;">Precio de Compra</label>'+
                        '<input class="mdl-textfield__input" type="text" value="'+datos[3].innerHTML+'" readonly>'+
                        '<br>'+
                        '<label class="text-condensedLight" style="float:left;font-size:20px;">Precio de Venta</label>'+
                        '<input class="mdl-textfield__input" type="text" value="'+datos[4].innerHTML+'" readonly>'+
                        '<br>'
    
        swal({
              title: 'Información del Producto',
              html: textHTML,
              width: "570px",
              confirmButtonText: 'Ok',
              closeOnConfirm: true
        });
    } 
    //funcion inicializacion pensada para poder ser llamada en el caso de que se genere nuevos elementos html 
//desde javascript
FuncionesProducto["init"] = function (argument) {
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
		//funcionesProducto mientras se usa otra como por ejemplo cedula
		var solonum = elements[i].getAttribute("solonum") || false;
		if (solonum) {
			elements[i].addEventListener("keypress",FuncionesProducto["NumeroEntero"])
			elements[i].addEventListener("keyup",FuncionesProducto["NumeroEntero"])
		};
		var solodecimal = elements[i].getAttribute("solodecimal") || false;
		if (solodecimal) {
			elements[i].addEventListener("keypress",FuncionesProducto["NumDecimal"])
			elements[i].addEventListener("keyup",FuncionesProducto["NumDecimal"])
		};
		var soloLetras = elements[i].getAttribute("soloLetras") || false;
		if (soloLetras) {
			elements[i].addEventListener("keypress",FuncionesProducto["soloLetras"])
			elements[i].addEventListener("keyup",FuncionesProducto["soloLetras"])
			elements[i].addEventListener("blur",FuncionesProducto["soloLetras"])
		};
		var EnterNext = elements[i].getAttribute("EnterNext") || false;
		if (EnterNext) {elements[i].addEventListener("keyup",FuncionesProducto["EnterNext"])};

		if ( atributo && FuncionesProducto[atributo] ){
			var evento = elements[i].getAttribute("event") || false;
			//modificacion del codigo para poder agregar más de 1 evento a las funcionesProducto
			if (evento) {
				var arrayEvent = evento.split(",")
				if (arrayEvent.length > 1) {
					for (var i = 0; i < arrayEvent.length; i++) {
						elements[i].addEventListener(arrayEvent[i],FuncionesProducto[atributo]);
					};
				}
				else{
					elements[i].addEventListener(evento,FuncionesProducto[atributo]);
				}
			}
			elements[i].addEventListener("change",FuncionesProducto[atributo]);
			/*elements[i].addEventListener("paste", function (e) {
				e.preventDefault();
				return false;
			});*/
		}
	}
}
    FuncionesProducto.init();