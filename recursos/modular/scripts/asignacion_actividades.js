function asignacion(identificador){
    //Obtenemos la cedula del empleado
    var envio={'cedula':identificador.id},
    /*Obtenemos la fecha y hora actual */
        fecha=new Date, horaInicial=``, horaFinal=``, minuto,hora,horaF=fecha.getHours()+1;
    //Acomodamos la hora para que no este fuera de formato con las cajas de texto de tipo fecha y hora
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

    if((fecha.getMonth()+1)<=9)
        nuevoMes='0'+(fecha.getMonth()+1);
    else
        nuevoMes=fecha.getMonth()+1;
    //Una vez acomodado ya podemos obtener una cadena presentable
    var cadenaFecha=`${fecha.getFullYear()}-${nuevoMes}-${nuevoDia}`;
    //Obtenemos todos los clientes para ponerlos en un select
    var todosClientes=document.getElementById('todosClientes').innerHTML;
    //Hacemos una petición de empleados por medio de la cédula
    $.ajax({
        type:"POST",
        url:"/admin/datos-empleados",
        dataType:"json",
        async:false,
        contentType:"application/json",
        data: JSON.stringify(envio)
    }).done(function(resp){
        //Creamos un codigo html para enbeber 
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
                                    <input readonly id="tmHrAsig" style="text-align:center" class="mdl-textfield__input form-control" value="${horaInicial}" type="time">
                                </div>
                                <div style="position:relative" class="form-group " onmouseover="inforElement('Escoja al cliente que necesita un servicio')" >
                                    <label>Cliente (cédula)</label>                                  
                                    <input id="lblCedClien" type="text" list="clientes" class="mdl-textfield__input form-control" autofocus>   
                                    <label>O escoja</label>
                                    <select id="selecCedula" class="form-control input-field" size="4" onclick="getCedula()">
                                        ${todosClientes}
                                    </select>                            
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div class="form-group" onmouseover="inforElement('Fecha a realizar la actividad')">
                                    <label>Fecha de asignación</label>
                                    <input readonly style="text-align:center" id="cedu_emple" id="dtFechAsig" value="${cadenaFecha}" type="date" class="mdl-textfield__input form-control">
                                </div>
                                <div class="form-group" onmouseover="inforElement('Hora esperada de finalización de la actividad')">
                                    <label>Hora de Finalización del servicio</label> 
                                    <input id="tmHrFnl" style="text-align:center"  class="mdl-textfield__input form-control" value="${horaFinal}" type="time">
                                </div>
                                <div class="form-group " onmouseover="inforElement('Indique la información necesaria acerca de la actividad')">
                                    <label>Detalle de la actividad</label> 
                                    <textarea id="lblDesc" required style="resize: none;" class="mdl-textfield__input form-control" rows="7" cols="50">
                                    </textarea>
                                </div>
                                
                            </div>
                            
                        </div>                      
                    </div>
                   `;
        //Mostramos un modal presnetando el html que habiamos creado anteriormente
        swal({
            title: `Servicio N°: ${Number(resp.Conta_Emp)+1}`,
            html: formulario,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: false
        }, function (isConfirm) {
            document.getElementById('lblCedClien').focus();
            if (isConfirm) {
                //Si confirma obtiene los datos ingresados
                var actividad=document.getElementById('lblDesc').value,
                    cliente=document.getElementById('lblCedClien').value,
                    horaInicializacion=document.getElementById('tmHrAsig').value,
                    detalle=(document.getElementById('lblDesc').value).trim(),
                    horaFinalizacion=document.getElementById('tmHrFnl').value,
                    ha=Number(horaInicializacion.substr(0,2)),
                    hf=Number(horaFinalizacion.substr(0,2)),
                    error='';            
                //Ahora realiza las validaciones por horario de trabajo o campos vacios
                if(resp.Tur_Emp=='Matutino'){
                    if((ha<6 || ha>14) || (hf<6 || hf>14) )
                        error='Esta hora esta fuera del horario del empleado';                  
                }
                if(resp.Tur_Emp=='Vespertino'){
                    if((ha<14 || ha>19) || (hf<14 || hf>19))
                        error='Esta hora esta fuera del horario del empleado';                  
                }
                if(resp.Tur_Emp=='Nocturno'){
                    if(((ha<=6 || ha>=19) && (hf<6 || hf>=19)))
                        error=''
                    else
                        error='Esta hora esta fuera del horario del empleado';                  
                }
                if(detalle=='')
                    error+=`- No ha definido un detalle`
                $.ajax({
                    type:"POST",
                    url:"/admin/cedula-cliente",
                    async:false,
                    contentType:"application/json",
                    data: JSON.stringify({'cedula':cliente})
                }).done(function(cedulaCliente){
                    //Verificamos que el cliente ingresado este registrado
                    if(cedulaCliente!=1)
                        error+=`- Este cliente no está registrado`;
                    if(error!='')
                        swal('Error inesperado', error,'error' )
                    else{
                        //Establecemos los parametros a guardar en la BAse de datos
                        envio={
                            'cedulaEmp':resp.Ced_Emp,
                            'fechaAsig':cadenaFecha,
                            'horaAsig':horaInicializacion,
                            'horaFAsig':horaFinalizacion,
                            'cedulaCli':cliente,
                            'descripcion':detalle,
                            'contador':Number(resp.Conta_Emp)+1
                        }
                        var guardado='';
                        $.ajax({
                            type:"POST",
                            url:"/admin/registrar_actividad",
                            dataType:"text",
                            async:false,
                            contentType:"application/json",
                            data: JSON.stringify(envio)
                        }).done(function(guard){
                            //Eventos Si la actividad esta registrada correctamente o si hubo un error
                            if(guard=='mal')
                                swal('No se ha podido registrar la actividad','Por favor intentelo de nuevo','error');
                            else
                                swal('Correcto', 'Actividad asignada con éxito',  'success' )
                            location.reload();        
                        })
                    }
                })               
            }
        });
    });
}
function liberacion(identificador){
    //Obtiene la cédula del empleado a liberar
    var envio={'cedulaEmp':identificador.id};
    swal({
        title: `Está seguro de liberar de sus actividades al empleado`,
        html: 'Estos cambios no se pueden deshacer',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: false
    }, function (isConfirm) {
        if(isConfirm){
            $.ajax({
                type:"POST",
                url:"/admin/liberar-empleados",
                dataType:"text",
                async:false,
                contentType:"application/json",
                data: JSON.stringify(envio)
            }).done(function(resp){
                //Si el empleado pudo liberarse de una actividad 
                swal(
                    'Actividad finalizada con éxito',
                    'Empleado listo para otra actividad',
                    'success'
                  )
                  location.reload();
            });           
        }
    })
}
function getCedula(){
    //Permite obtener la cédula necesaria
    var escogido=document.getElementById('selecCedula').value;
    document.getElementById('lblCedClien').value=escogido;
}