function VerPDF(){
    textHTML = '<div>'+
        '<object data="../general/documentos/ManualUsuario.pdf" type="application/pdf" width="700" height="400">'+
        'alt : <a href="../general/documentos/ManualUsuario.pdf">Manual de Usuario.pdf</a>'+
        '</object>'+
    '</div>'
    swal({
	  	title: 'Manual de Usuario',
	  	html: textHTML,
	  	width: "800px",
	  	confirmButtonText: 'Cerrar',
	  	closeOnConfirm: true
	});
}