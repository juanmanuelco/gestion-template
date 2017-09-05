function Enviar (e,obj){
    e.preventDefault();
    var form = obj.form
	if (!form) {return false}
	var bool = ValidarDatosFormulario(form);
	if (bool){ 
	swal({
        title: '¿Está seguro de guardar los cambios?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        closeOnConfirm: true
    },
    function(isConfirm) {
        if (isConfirm) {
            form.submit();
        }
        else{
            return false;
        }
    });
	}
}