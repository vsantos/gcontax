function validateBillingInput() {
	validator = true;

	var billingCompany = document.getElementById("billingCompany");
	var serviceType = document.getElementById("serviceType");
	var billingEmissionDate = document.getElementById("billingEmissionDate");
	var billingExpirationDate = document.getElementById("billingExpirationDate");
	var billingCost = document.getElementById("billingCost");
	
	if (billingCompany.value === '' || billingCompany.value === null) {
		document.getElementById("billingCompanyLabel").style = 'color: rgba(204,0,0,1);';
		validator = false;
	} else {
		document.getElementById("billingCompanyLabel").style = '';
	}

	if (serviceType.value === '' || serviceType.value === null) {
		document.getElementById("serviceTypeLabel").style = 'color: rgba(204,0,0,1);';
		validator = false;
	} else {
		document.getElementById("serviceTypeLabel").style = '';
	}
	
	if (billingEmissionDate.value === '' || billingEmissionDate.value === null) {
		document.getElementById("billingEmissionDateLabel").style = 'color: rgba(204,0,0,1);';
		validator = false;
	} else {
		document.getElementById("billingEmissionDateLabel").style = '';
	}
	
	if (billingExpirationDate.value === '' || billingExpirationDate.value === null) {
		document.getElementById("billingExpirationDateLabel").style = 'color: rgba(204,0,0,1);';
		validator = false;
	} else {
		document.getElementById("billingExpirationDateLabel").style = '';
	}
	
	if (billingCost.value === '' || billingCost.value === null) {
		document.getElementById("billingCostLabel").style = 'color: rgba(204,0,0,1);';
		validator = false;
	} else {
		var billingCostParsed = '';
		billingCostParsed = billingCost.value.replace(',','.');
		console.log(billingCostParsed);
		document.getElementById("billingCostLabel").style = '';
	}

	if (validator === true) {
		registerBilling(billingCompany.value, serviceType.value, billingEmissionDate.value, billingExpirationDate.value, billingCostParsed);
	}
}

function registerBilling(billingCompany, serviceType, billingEmissionDate, billingExpirationDate, billingCost) {
	// Getting Service Type and splitting to save in different Table columns
	serviceType = serviceType.split(' - ');
	var serviceTypeCod = parseInt(serviceType[0]);
	var serviceTypeDescription = serviceType[1];
		
	var BillingInfo = ['billingCompany','serviceType','billingEmissionDate','billingExpirationDate','billingCost'];
	var dataString = 'company='+ billingCompany + '&service_type_cod=' + serviceTypeCod + '&service_type_desc=' + serviceTypeDescription + '&emission=' + billingEmissionDate + '&expiration=' + billingExpirationDate + '&cost=' + billingCost;

	$.ajax({
		type: "POST",
		url: "/api/v1/billing",
		data: dataString,
		success: function (response) {
			//display message back to user here
			alert = alertSuccess(" Billing for company '<b>" + billingCompany + "</b>' created <br>- " + Date());
			document.getElementById('operationCompanyBillingMessage').innerHTML += alert;
			cleanInput(BillingInfo);
		},
		error: function (response) {
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false) {
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationCompanyBillingMessage').innerHTML += alert;
				}
			}
		}
	});
}

function getCompaniesName() {
	$.ajax({
		type: "GET",
		url: "/api/v1/company",
		success: function (response) {
			//display message back to user here
			document.getElementById('billingCompany').innerHTML = '<option></option>';
			for (var i = 0; i < response['companies'].length; i++) {
				document.getElementById('billingCompany').innerHTML +=
					"<option>" + response['companies'][i]['name'] + "</option>";
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
					document.getElementById('operationCompanyBillingMessage').innerHTML += alert;
				}
			}
		}
	});
}

function getBillings() {
	var paid_count = 0;
	var paid_color = '';
	var button_disabled = '';

	$.ajax({
		type: "GET",
		url: "/api/v1/billing",
		success: function (response) {
			console.log(response['billings']);
			//display message back to user here
			document.getElementById('dynamicBillingTable').innerHTML = '';
			for (var i = 0; i < response['billings'].length; i++) {
				if (response['billings'][i]['paid'] === 0) {
					paid_count += 1;
					button_disabled = '';
					paid_color = 'rgba(255, 75, 100, 0.5)'
				} else {
					button_disabled = 'disabled';
					paid_color = 'rgba(140, 255, 140, 0.5);';
				}

				document.getElementById('dynamicBillingTable').innerHTML +=
					"<td> \
						<button type='button' class='btn btn-success btn-sm " + button_disabled + " '> \
							<span class='glyphicon glyphicon-usd'></span> \
						</button> \
					</td>" + 
					"<td class='content_" + response['billings'][i]['id'] + "'>" + response['billings'][i]['id'] + "</td>" +
					"<td class='text-center'>" + response['billings'][i]['company'] + "</td>" +
					"<td class='text-center' style='background-color:" + paid_color + ";'>" + response['billings'][i]['cost'] + "</td>" +
					"<td class='text-center'>" + response['billings'][i]['service_type_code'] + "</td>" +
					"<td class='text-center'>" + response['billings'][i]['service_type_des'] + "</td>" +
					"<td class='text-center'>" + response['billings'][i]['emission'] + "</td>" +
					"<td class='text-center'>" + response['billings'][i]['expiration'] + "</td>" +
					"</tr>";
			
			}
			
			document.getElementById('not_paid_count').innerHTML = paid_count;
			alert = alertSuccess(" Query worked <br>-" + Date());
			//document.getElementById('operationCompanyMessage').innerHTML += alert;
		},
		error: function (response) {
			console.log('error');
			console.log(response);
			if (response.hasOwnProperty('responseJSON')) {
				if (response.responseJSON['status'] == false) {
					alert = alertFailed(" Operation failed, check the logs for details <br>- " + Date());
					document.getElementById('operationCompanyBillingMessage').innerHTML += alert;
				}
			}
		}
	});
}

function PrintElem()
{
    var mywindow = window.open('_self', 'PRINT', 'height=400,width=600,titlebar=yes');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write('Data de emissão: ' + document.getElementById('date').value);
	mywindow.document.write('Data de expiração: ' + document.getElementById('date2').value);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}