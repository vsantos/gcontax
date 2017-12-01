function validateClientInput(){
	validator = true;
	clientName = document.getElementById("clientName");
	clientCPF = document.getElementById("clientCPF");
	clientEmail = document.getElementById("clientEmail");
	clientPhone = document.getElementById("clientPhone");
	clientCity = document.getElementById("clientCity");
	clientCEP = document.getElementById("clientCEP");
	clientAddress = document.getElementById("clientAddress");
	
	if (clientName.value == '' || clientName.value == null) {
		clientName.style.border = '1px solid rgba(204,0,0,0.7)';
		clientNameMsg.style = 'color: rgba(204,0,0,0.7);font-size:12px;';
		clientNameMsg.innerHTML = 'Client name must not be empty';
		validator = false;
	} else {
		clientName.style.border = '';
		clientNameMsg.style = '';
		clientNameMsg.innerHTML = '';
	}
	
	if (clientCPF.value == '' || clientCPF.value == null) {
		clientCPF.style.border = '1px solid rgba(204,0,0,0.7)';
		clientCPFMsg.style = 'color: rgba(204,0,0,0.7);font-size:12px;';
		clientCPFMsg.innerHTML = 'Client CPF must not be empty';
		validator = false;
	} else {
		clientCPF.style.border = '';
		clientCPFMsg.style = '';
		clientCPFMsg.innerHTML = '';
	}
	
	if (validator == true){
		registerClient(clientName.value, clientCPF.value, clientEmail.value, clientPhone.value, clientCity.value, clientCEP.value, clientAddress.value);
	}
}

function registerClient(clientName, clientCPF, clientEmail, clientPhone, clientCity, clientCEP, clientAddress){
	
	var clientInfo = ['clientName','clientCPF','clientEmail','clientPhone','clientCity','clientCEP','clientAddress']
	var dataString = 'name='+ clientName + '&cpf=' + clientCPF + '&email=' + clientEmail + '&phone=' + clientPhone + '&city=' + clientCity + '&cep=' + clientCEP + '&address=' + clientAddress;
	
	$.ajax({
    	type: "POST",
    	url: "/api/v1/client",
    	data: dataString,
    	success: function(response) {
      		//display message back to user here
			alert = alertSuccess(" Client <b>'" + clientName + "'</b> created <br>- " + Date());
			console.log(alert);
			document.getElementById('operationClientMessage').innerHTML += alert;
    	},
		error: function(response){
			console.log(dataString);
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false){
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationClientMessage').innerHTML += alert;
				}
			}
		}
  	});
	
	// Cleaning inputs
	cleanInput(clientInfo);
}

function getClients(){
	$.ajax({
    	type: "GET",
    	url: "/api/v1/client",
    	success: function(response) {
      		//display message back to user here
			document.getElementById('dynamicClientsTable').innerHTML = '';
			for (var i=0; i < response['clients'].length; i++) {
				document.getElementById('dynamicClientsTable').innerHTML +=
						"<td>" + response['clients'][i]['id'] + "</td>" + 
						"<td>" + response['clients'][i]['name'] + "</td>" + 
						"<td>" + response['clients'][i]['cpf'] + "</td>" +
						"<td>" + response['clients'][i]['email'] + "</td>" + 
						"<td>" + response['clients'][i]['phone'] + "</td>" + 
						"<td>" + response['clients'][i]['city'] + "</td>" + 
						"<td>" + response['clients'][i]['cep'] + "</td>" + 
						"<td>" + response['clients'][i]['address'] + "</td>" + 
					"</tr>";
			}

			alert = alertSuccess(" Query worked <br>-" + Date());
			//document.getElementById('operationClientMessage').innerHTML += alert;
    	},
		error: function(response){
			console.log('error');
			console.log(response);
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false){
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationClientMessage').innerHTML += alert;
				}
			}
		}
  	});
}

function editClientInfo(){
	// Do the PUT method
}