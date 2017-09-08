function msgModal (title,type,accion) {
		var close = true
		if (accion) {close = false};
		swal({
	  	title: title,
	  	type: type,
	  	confirmButtonText: 'Ok',
	  	closeOnConfirm: close
		},
		function(isConfirm) {
			if (isConfirm) { 
				if (accion == "retroceder") {
					window.history.back();
				}
		  	}
		}
		)
	}