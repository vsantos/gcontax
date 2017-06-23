function cleanInput(localList){
	for(var i=0; i < localList.length; i++){
		item = localList[i]
		document.getElementById(item).value = '';
	}
}

function alertSuccess(messageDetails){
	alert = 
		"<div class='alert alert-success alert-dismissable'> \
			<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a> \
			<strong>Success!</strong>" + messageDetails +
		"</div>";
	return alert;
}

function alertFailed(messageDetails){
	alert = 
		"<div class='alert alert-danger alert-dismissable'> \
			<button href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</button> \
			<strong>Ops!! </strong>" + messageDetails + "</div>";

	return alert;
}