function asignacion(identificador){
    var envio={'cedula':identificador.id}
    var fecha=new Date;
    var horaInicial=``;
    var horaFinal=``;
    var minuto,hora,horaF=fecha.getHours()+1;
    if(fecha.getHours()<10)
        hora='0'+fecha.getHours();
    else
        hora=fecha.getHours();

    if(fecha.getMinutes()<10)
        minuto='0'+fecha.getMinutes();
    else
        minuto=fecha.getMinutes();

    if(horaF<10)
        horaF='0'+horaF;

    var nuevoDia,nuevoMes;
    horaInicial=`${hora}:${minuto}`;
    horaFinal=`${horaF}:${minuto}`
    if(fecha.getDate()<10)
        nuevoDia='0'+fecha.getDate();
    else
        nuevoDia=fecha.getDate();

    if((fecha.getMonth()+1)<10)
        nuevoMes='0'+fecha.getMonth();
    else
        nuevoMes=fecha.getMonth();

    var cadenaFecha=`${fecha.getFullYear()}-${nuevoMes}-${nuevoDia}`;
    var todosClientes=document.getElementById('todosClientes').innerHTML;
    $.ajax({
        type:"POST",
        url:"/admin/datos-empleados",
        dataType:"json",
        async:false,
        contentType:"application/json",
        data: JSON.stringify(envio)
    }).done(function(resp){
        var formulario=`<div>
                        <h3>Designado a: <b id="lblCedEmpl">${resp.Nomb_Emp} </b></h3><br>
                        <div class="row">
                            <div class="col-lg-6 col-md-6">
                                <div class="form-group" onmouseover="inforElement('Cédula del empleado designado')">
                                    <label>Cédula del Empleado</label>
                                    <input style="text-align:center" id="cedu_asig" type="number" value="${resp.Ced_Emp}" class="mdl-textfield__input form-control" readonly>
                                </div>
                                <div class="form-group" onmouseover="inforElement('Hora en que será asignada la tarea')">
                                    <label>Hora de asignación del servicio</label> 
                                    <input id="tmHrAsig" style="text-align:center" class="mdl-textfield__input form-control" value="${horaInicial}" type="time">
                                </div>
                                <div style="position:relative" class="form-group " onmouseover="inforElement('Escoja al cliente que necesita un servicio')" >
                                    <label>Cliente</label>                                  
                                    <input id="lblCedClien" type="text" list="clientes" class="mdl-textfield__input form-control" autofocus>
                                    <datalist id="clientes">
                                        ${todosClientes}
                                    </datalist>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div class="form-group" onmouseover="inforElement('Fecha a realizar la actividad')">
                                    <label>Fecha de asignación</label>
                                    <input style="text-align:center" id="cedu_emple" id="dtFechAsig" value="${cadenaFecha}" type="date" class="mdl-textfield__input form-control">
                                </div>
                                <div class="form-group" onmouseover="inforElement('Hora esperada de finalización de la actividad')">
                                    <label>Hora de Finalización del servicio</label> 
                                    <input id="tmHrFnl" style="text-align:center"  class="mdl-textfield__input form-control" value="${horaFinal}" type="time">
                                </div>
                                <div class="form-group " onmouseover="inforElement('Indique la información necesaria acerca de la actividad')">
                                    <label>Detalle de la actividad</label> 
                                    <textarea id="lblDesc" required style="resize: none;" class="mdl-textfield__input form-control" rows="4" cols="50">Hágase el favor de:
                                    </textarea>
                                </div>
                                
                            </div>
                            
                        </div>                      
                    </div>
                   `;
        swal({
            title: `Servicio N°: ${Number(resp.Conta_Emp)+1}`,
            html: formulario,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: false
        }, function (isConfirm) {
            if (isConfirm) {
                var actividad=document.getElementById('lblDesc').value;
                var cliente=document.getElementById('lblCedClien').value;
                swal({
                    title: `¿Está seguro de asignar la tarea a ${resp.Nomb_Emp} ?`,
                    html: `<b>Actividad</b><br>
                            <p>${actividad}</p><br>
                            <label>Para el cliente ${cliente}</lable>`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            location.reload();
                        }else{
                            alert('ha cancelado')
                        }
                    });
            }
        });
        $(".js-example-basic-single").select2();
    });
}
function liberacion(identificador){
    $('#modalLiberacion').modal({backdrop: "static"})
}
function seleccionador(){
    $(".js-example-basic-single").select2();
}