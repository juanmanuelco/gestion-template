function mostrarGrafico(forma, id) {//Dependiendo de la forma escogida se mostrará el gráfico
    var ctx = document.getElementById(id);//El id hace referencia a donde se enviara el grafico
    var T_colores = new Array();
    var meses = new Array(12);
    var nombMeses = new Array(12);
    nombMeses[0] = 'Enero', nombMeses[1] = 'Febrero',
    nombMeses[2] = 'Marzo ', nombMeses[3] = 'Abril', nombMeses[4] = 'Mayo',
    nombMeses[5] = 'Junio', nombMeses[6] = 'Julio', nombMeses[7] = 'Agosto',
    nombMeses[8] = 'Septiembre', nombMeses[9] = 'Octubre ',nombMeses[10] = 'Noviembre',
    nombMeses[11] = 'Diciembre'
    for (var i = 0; i < meses.length; i++) {
        meses[i] = 0;
    }
    $.ajax({
        type: "GET",
        url: '/admin/todas-ventas',
        dataType: "json",
        async: false,
        contentType: "text/plain",
        success: function (ventas) {
            for (var dato in ventas.ventas) {               
                console.log(ventas.ventas[dato].Fech_Vent)
                var fechaCompleta = (ventas.ventas[dato].Fech_Vent).toString()
                var fecha = fechaCompleta.split('/', 3)
                var dia = fecha[0], mes = fecha[1], anio = fecha[2]
                console.log(dia)
                if (anio == "2017") {//2017 Se cambiara despues por año seleccionado
                    for (var i = 0; i < 13; i++) {
                        T_colores.push(colores()) 
                        if (parseInt(mes) == (i+1)) {
                            meses[i] += 1
                        }
                    }
                }
            }
           
            for (var i = 0; i < 12; i++) {
                console.log(i+1+"mes    "+meses[i])                
            }
    
            //Datos del grafico
            var datos={
                labels: nombMeses,//Todos los meses
                datasets: [{
                    label: 'Número de ventas realizadas',
                    data: meses,
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
        }
    })

}

function colores() {
    var hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
    var color_aleatorio = "#";
    for (i = 0; i < 6; i++) {
        var posarray = aleatorio(0, hexadecimal.length)
        color_aleatorio += hexadecimal[posarray]
    }
    return color_aleatorio
}
function aleatorio(inferior, superior) {
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
}

