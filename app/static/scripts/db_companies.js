function validateCompanyInput() {
	validator = true;
	companyName = document.getElementById("companyName");
	companyCNPJ = document.getElementById("companyCNPJ");
	companyPhone = document.getElementById("companyPhone");
	companyCity = document.getElementById("companyCity");
	companyCEP = document.getElementById("companyCEP");
	companyAddress = document.getElementById("companyAddress");

	if (companyName.value == '' || companyName.value == null) {
		companyName.style.border = '1px solid rgba(204,0,0,0.7)';
		companyNameMsg.style = 'color: rgba(204,0,0,0.7);font-size:12px;';
		companyNameMsg.innerHTML = "Company's name must not be empty";
		validator = false;
	} else {
		companyName.style.border = '';
		companyNameMsg.style = '';
		companyNameMsg.innerHTML = '';
	}

	if (companyCNPJ.value == '' || companyCNPJ.value == null) {
		companyCNPJ.style.border = '1px solid rgba(204,0,0,0.7)';
		companyCNPJMsg.style = 'color: rgba(204,0,0,0.7);font-size:12px;';
		companyCNPJMsg.innerHTML = "Company's CNPJ must not be empty";
		validator = false;
	} else {
		companyCNPJ.style.border = '';
		companyCNPJMsg.style = '';
		companyCNPJMsg.innerHTML = '';
	}

	if (validator == true) {
		registerCompany(companyName.value, companyCNPJ.value, companyPhone.value, companyCity.value, companyCEP.value, companyAddress.value);
	}
}

function registerCompany(companyName, companyCNPJ, companyPhone, companyCity, companyCEP, companyAddress) {

	var companyInfo = ['companyName', 'companyCNPJ', 'companyPhone', 'companyCity', 'companyCEP', 'companyAddress']
	var dataString = 'name=' + companyName + '&cnpj=' + companyCNPJ + '&phone=' + companyPhone + '&city=' + companyCity + '&cep=' + companyCEP + '&address=' + companyAddress;

	$.ajax({
		type: "POST",
		url: "/api/v1/company",
		data: dataString,
		success: function (response) {
			//display message back to user here
			alert = alertSuccess(" Company <b>'" + companyName + "'</b> created <br>- " + Date());
			document.getElementById('operationCompanyMessage').innerHTML += alert;
		},
		error: function (response) {
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false) {
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationCompanyMessage').innerHTML += alert;
				}
			}
		}
	});

	// Cleaning inputs
	cleanInput(companyInfo);
}

function getCompanies() {
	$.ajax({
		type: "GET",
		url: "/api/v1/company",
		success: function (response) {
			//display message back to user here
			document.getElementById('dynamicCompaniesTable').innerHTML = '';
			for (var i = 0; i < response['companies'].length; i++) {
				document.getElementById('dynamicCompaniesTable').innerHTML +=
					"<td>" + response['companies'][i]['id'] + "</td>" +
					"<td>" + response['companies'][i]['name'] + "</td>" +
					"<td>" + response['companies'][i]['cnpj'] + "</td>" +
					"<td>" + response['companies'][i]['phone'] + "</td>" +
					"<td>" + response['companies'][i]['city'] + "</td>" +
					"<td>" + response['companies'][i]['cep'] + "</td>" +
					"<td>" + response['companies'][i]['address'] + "</td>" +
					"</tr>";
			}

			alert = alertSuccess(" Query worked <br>-" + Date());
			//document.getElementById('operationCompanyMessage').innerHTML += alert;
		},
		error: function (response) {
			console.log('error');
			console.log(response);
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false) {
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationCompanyMessage').innerHTML += alert;
				}
			}
		}
	});
}