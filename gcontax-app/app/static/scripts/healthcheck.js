function status_database(){
	console.log('');
}

function status_webserver(){
	$.ajax({
		type: "GET",
		url: "http://localhost/admin",
		success: function (response) {
			document.getElementById('webserverHC').className = 'HCsuccess';
		},
		error: function (response) {
			document.getElementById('webserverHC').className = 'HCdanger';
		}
	});
}