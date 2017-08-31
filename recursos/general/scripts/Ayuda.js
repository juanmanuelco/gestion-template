function inforElement(mensaje){
    document.getElementById('infoElemento').innerText=mensaje;
}

//Remplaza muestra por el id del elemento a imprimir
function imprimir(muestra){ 
	var ficha=document.getElementById(muestra);
	var ventimp=window.open(' ','popimpr');
	ventimp.document.write(ficha.innerHTML);
	var estiloFactura=ventimp.document.createElement("link");
	estiloFactura.setAttribute("href","")// Aqui va el archivo css que se desee mostrar en impresora
	estiloFactura.setAttribute("rel", "stylesheet");
	estiloFactura.setAttribute("type", "text/css");
	ventimp.document.head.appendChild(estiloFactura);
	ventimp.document.close();
	ventimp.print();
	ventimp.close();	
}