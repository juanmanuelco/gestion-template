function mostrarGrafico(forma, id){
    //Aqui aparecerán los gráficos
    var ctx = document.getElementById(id);
    //Aqui iran los datos que sse reciben de la base de datos
    var T_empleados=new Array();
    var actividades=new Array();
    var T_colores=new Array();
    
    $.ajax({
        type:"GET", 
        url:'/admin/tod-empleados', 
        dataType:"json", 
        async:false,
        contentType:"text/plain", 
        success: function(empleados){
            //Cada empleado junto con su numero de actividades es guardado en un array
            empleados.forEach(function(element) {
                T_empleados.push(element.Nomb_Emp+' '+element.Ced_Emp)
                actividades.push(element.Conta_Emp)
                T_colores.push(colores())
            }, this);
            //Definimos los datos que irán en el gráfico
            var datos={
                /*Ponemos aqui todos los empleados */
                labels: T_empleados,
                datasets: [{
                    label: 'Número de actividades realizadas',
                     /*Ponemos aqui todos actividades por empleado */
                    data: actividades,
                     /*Ponemos aqui un color rándom para cada empleado*/
                    backgroundColor: T_colores,
                     /*Ponemos aqui un color negro para los bordes*/
                    borderColor: ['#000','#000','#000','#000','#000','#000'],
                     /*Definimos un ancho para el borde*/
                    borderWidth: 0.7
                }]
            };
            var GraficoActividades = new Chart(ctx, {
                type: forma,
                data: datos,
                options:{
                    legend:{
                        position:'left'
                    }
                }
            });
        }})
    
}

    function colores(){
        //Declaramos todos los posibles casos de colores hexadecimales
        var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
        var color_aleatorio = "#";
        //Hacemos una cadea de 6 caracteres
        for (i=0;i<6;i++){
            var posarray = aleatorio(0,hexadecimal.length)
            color_aleatorio += hexadecimal[posarray]
        }
        return color_aleatorio
    }
    function aleatorio(inferior,superior){
        //Obtenemos aleatoriamente una cadena que forma un color hexadecimal
        numPosibilidades = superior - inferior
        aleat = Math.random() * numPosibilidades
        aleat = Math.floor(aleat)
        return parseInt(inferior) + aleat
    } 

