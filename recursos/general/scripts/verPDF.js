function VerPDF(){
    textHTML = '<div>'+
        //'<object data="../general/documentos/ManualUsuario.pdf" type="application/pdf" width="700" height="400">'+
        //'alt : <a href="../general/documentos/ManualUsuario.pdf">Manual de Usuario.pdf</a>'+
        //'</object>'+
       '<iframe src="http://docs.google.com/gview?url=http://fblearn.com/ManualUsuario.pdf&embedded=true" style="width:780px; height:375px;" frameborder="0"></iframe>'+
    '</div>'
    swal({
	  	title: 'Manual de Usuario',
	  	html: textHTML,
	  	width: "800px",
	  	confirmButtonText: 'Cerrar',
	  	closeOnConfirm: true
	});
}