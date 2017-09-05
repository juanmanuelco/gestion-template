function mostrarGrafico(forma, id){
    var ctx = document.getElementById(id);
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
            empleados.forEach(function(element) {
                T_empleados.push(element.Nomb_Emp+' '+element.Ced_Emp)
                actividades.push(element.Conta_Emp)
                T_colores.push(colores())
            }, this);
            var datos={
                labels: T_empleados,
                datasets: [{
                    label: 'Número de actividades realizadas',
                    data: actividades,
                    backgroundColor: T_colores,
                    borderColor: ['#000','#000','#000','#000','#000','#000'],
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
        var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
        var color_aleatorio = "#";
        for (i=0;i<6;i++){
            var posarray = aleatorio(0,hexadecimal.length)
            color_aleatorio += hexadecimal[posarray]
            }
        return color_aleatorio
    }
    function aleatorio(inferior,superior){
        numPosibilidades = superior - inferior
        aleat = Math.random() * numPosibilidades
        aleat = Math.floor(aleat)
        return parseInt(inferior) + aleat
    } 

