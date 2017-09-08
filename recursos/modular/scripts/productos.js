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

function saveProducto(e,button){
    e.preventDefault();
    var form = button.form
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
                title: '¿Seguro que desea registrar este nuevo producto?',
                showCancelButton: true,
			  	confirmButtonText: 'Si',
                cancelButtonText:'No',
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
function validarProducto (input) {
    var divPadre = input.parentNode
    if  (input.value.trim()==''){return false;}
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


function deleteProduct (e,button) {
    var divpadre = button.parentNode.parentNode;
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
                if (data[0].Exis_Prod > 0){
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
function editProducto (e,button) {
    var divpadre = button.parentNode.parentNode
    var divButton = divpadre.parentNode
    var datos = divButton.parentNode.getElementsByTagName("td")
    var formhtml = '<form id="editForm" style="text-align: left;"  enctype="multipart/form-data" action="/admin/editarProducto?Cod_Prod='+datos[0].innerHTML+'" method="post">'+
    '<div class="mdl-grid">'+
            '<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
                '<label class="text-condensedLight" style="font-size:20px;">Foto del producto</label>'+
                '<div class="div_file btn">'+
                    '<p class="texto">Cambiar imagen (102x102) </p>'+
                    '<input type="file" class="btn_enviar mdl-textfield__input" id="file_url" accept=".jpg,.png," name="image_producto" onchange="alertaOferta(this,this.files[0].size)" required/>'+
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
        '<div class="mdl-cell mdl-cell--8-col-phone mdl-cell--8-col-tablet mdl-cell--12-col-desktop">'+
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
                '<label class="text-condensedLight" style="font-size:20px;">Código del Producto</label>'+
                '<input class="mdl-textfield__input" type="text" id="Cod_Prod" name="Cod_Prod"'+
                ' EnterNext="true" idNext="Des_Prod" value="'+datos[0].innerHTML+'" readonly="readonly">'+
                '<label class="mdl-textfield__label" for="Cod_Prod" maxlength="5" requerido></label>'+
                '<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese Solo Números en Cédula</span>'+
            '</div>'+
        '</div>'+
        '<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
                '<label class="text-condensedLight" style="font-size:20px;">Descripción</label>'+
                '<input class="mdl-textfield__input" type="text" id="Des_Prod" name="Des_Prod" EnterNext="true" idNext="Exis_Prod" soloLetras="true" maxlength="100" value="'+datos[1].innerHTML+'" maxlength="60" requerido>'+
                '<label class="mdl-textfield__label" for="Des_Prod" ></label>'+
                '<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Solo se permite caracteres de la a a la z con tildes y espacios</span>'+
            '</div>'+
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
                '<label class="text-condensedLight" style="font-size:20px;">Existencia</label>'+
                '<input class="mdl-textfield__input" type="text" id="Exis_Prod" value="'+datos[2].innerHTML+'" name="Exis_Prod" solonum="true" EnterNext="true" idNext="PrecComp_Pro" maxlength="5" comprobarExistencia requerido>'+
                '<label class="mdl-textfield__label" for="Exis_Prod"></label>'+
                '<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese solo números</span>'+
            '</div>'+
        '</div>'+
        '<div class="mdl-cell mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--6-col-desktop">'+
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
                '<label class="text-condensedLight" style="font-size:20px;">Precio de Compra</label>'+
                '<input class="mdl-textfield__input" type="text" id="PrecComp_Pro" value="'+datos[3].innerHTML+'" name="PrecComp_Pro" solodecimal="true" EnterNext="true" idNext="PrecVen_Pro" maxlength="7" requerido>'+
                '<label class="mdl-textfield__label" for="PrecComp_Pro"></label>'+
                '<span class="mdl-textfield__error" style="font-weight: bold;font-size:14px;">Ingrese solo números</span>'+
            '</div>'+  
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">'+
                '<label class="text-condensedLight" style="font-size:20px;">Precio de Venta</label>'+
                '<input class="mdl-textfield__input" type="text" id="PrecVen_Pro" value="'+datos[4].innerHTML+'" name="PrecVen_Pro" solodecimal="true" maxlength="7" requerido>'+
                '<label class="mdl-textfield__label" for="PrecVen_Pro"></label>'+
                '<span class="mdl-textfield__error" id="mensajePV" style="font-weight: bold;font-size:14px;">Ingrese solo números</span>'+
            '</div>'+  
        '</div>'+
    '</div>'+
    '<label id="labelFormModal" style="display:none;color:#d50000;position:absolute;font-size:16px;margin-top:3px;">Por favor asegurese que todos los datos del formulario son correctos </label>'+
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

    setTimeout(function (a){
            Funciones.init();
            var inputs = document.getElementsByTagName("input")
            for (var a = 0; a < inputs.length; a++){
                if(inputs[a].getAttribute('comprobarExistencia')!=null){
                    inputs[a].addEventListener("blur",function(){
                        comprobarExistencia(this,true)
                    },false)
                }
            }
        },200);
}


function infoProductos (e,button) {
    var divpadre = button.parentNode.parentNode
    var divButton = divpadre.parentNode
    var datos = divButton.parentNode.getElementsByTagName("td")
    var textHTML='<div id="poder" style="display: block; left: 80%; position: absolute; margin:0 auto">'+
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


function validarPrecioVenta() {
    validacion = true
    var pv = document.getElementById("PrecVen_Pro").value||""
    var pc = document.getElementById("PrecComp_Pro").value||""
    pv = pv.replace(",", ".")
    pv = parseFloat(pv)
    pc = pc.replace(",", ".")
    pc = parseFloat(pc)
    if (pv<pc) {validacion=false;}
    if (!validacion) {
        var pv = document.getElementById("PrecVen_Pro")
        span = pv.parentNode.getElementsByTagName("span")
        if (span && span[0]) {span[0].innerHTML="El precio de venta debe ser mayor o igual al precio de compra"};
        pv.parentNode.classList.add("is-invalid");
        return false;
    };
    return true;
}

function comprobarExistencia(input,edicion){
    var array = input.value.split(".")
    var array2 = input.value.split(",")
    if ((array.length>1 || array2.length>1) && (parseInt(array[0]) && parseInt(array2[0]))){
        span = input.parentNode.getElementsByTagName("span")
        if (span && span[0]) {span[0].innerHTML="No puede ingresar valores decimales en este campo"};
        input.parentNode.classList.add("is-invalid");
        return false;
    }
    var existencia = parseInt(input.value) || 0;
    var minimo = 1
    if(edicion){
        minimo = 0;
    }
    if(existencia < minimo){
        span = input.parentNode.getElementsByTagName("span")
        if (span && span[0]) {span[0].innerHTML="La existencia no puede ser menor a "+minimo};
        input.parentNode.classList.add("is-invalid");
        return false;
    }
}