function changeContainerPanel(event){
	event.preventDefault();
	event.stopPropagation();
	var identifier = '#'+ $(this).data('li-name');
	$('.row-fluid').find('.container').hide();
	$('.row-fluid').find('.container').removeClass('hidden');
	$('.row-fluid').find(identifier).fadeIn(1000);

	//This part is for the sidebar .active change
	$(this).closest('.sidebar').find('.active').removeClass('active');
	$(this).addClass('active');
}

function prepartakersTableFilter(){
	var iteratorRow = $('.nameColumn').filter('.iterator').parent(),
			name = $('.nameColumn').filter('.iterator').data('prepartaker-name').toLowerCase(),
			text = $(this).val().toLowerCase(),
			tableLength = $('.nameColumn').length,
			pattern=new RegExp(text),
			i = 2;

	if(text === ''){
		$('.nameColumn').parent().slideDown();
	}else{
		if(pattern.test(name)){
			iteratorRow.slideDown();	
		}else{
			iteratorRow.slideUp();	
		}

		for (i; i <= tableLength; i++) {
			name = $('.nameColumn').filter('.iterator').parent().next().children(':first-child').data('prepartaker-name').toLowerCase();
			iteratorRow = $('.nameColumn').filter('.iterator').parent().next().children(':first-child').parent();
			//Comparacion
			if(pattern.test(name)){
				iteratorRow.slideDown();	
			}else{
				iteratorRow.slideUp();	
			}
			$('.nameColumn').filter('.iterator').parent().next().children(':first-child').addClass('iterator');
			$('.nameColumn').filter('.iterator:first').removeClass('iterator');
		}

		$('.nameColumn').filter('.iterator').removeClass('iterator');
		$('.nameColumn:first').addClass('iterator');
	}
}

function buttonValidate(event){
	event.preventDefault();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').show();
	$('#deleteFormContainer').hide();
	$('#prepartakersAdicionalInfoContainer').hide();
	$('#prepartakersAdicionalInfoContainer').fadeIn();
	$('#validateFormContainer').children().remove();

	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$.post('searchPrepartaker',  {name: name} , postButtonValidate);
}

function postButtonValidate(response){
	var form = $('<div class="span5 alert alert-success">'+
								'<ul class="nav nav-list">'+
									'<li><h4>'+response[0].partakerName+'</h4></li>'+
									'<li><h4>'+response[0].partakerMail+'</h4></li>'+
									'<li><h4>'+response[0].partakerPhone+'</h4></li>'+
									'<li><h4>'+response[0].partakerAddress+'</h4></li>'+
								'</ul>'+
							'</div>'+
							'<div class="span6">'+
								'<form action="/validatePrepartaker" method="POST" id="validatePrepartaker" class="form-horizontal">'+
									'<div class="control-group">'+
										'<label for="user" class="control-label pull-right"> Usuario</label>'+
										'<div class="controls">'+
											'<input type="text" id="user" name="user" required="required" class="input-large">'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label for="password" class="control-label">  Contraseña</label>'+
										'<div class="controls">'+
											'<input type="password" id="password" name="password" required="required" class="input-large">'+
										'</div>'+
									'</div>'+
									//PasswordConfirmation
									/*'<div class="control-group">'+
										'<label for="passwordConfirmation" class="control-label">  Confimar contraseña</label>'+
										'<div class="controls">'+
											'<input type="password" id="passwordConfirmation" name="passwordConfirmation" required="required" class="input-large">'+
										'</div>'+
									'</div>'+*/
									'<div class="control-group">'+
										'<label for="folio" class="control-label">  Folio</label>'+
										'<div class="controls">'+
											'<input type="text" id="folio" name="folio" required="required" class="input-large">'+
										'</div>'+
									'</div>'+
									'<input class="hidden" type="text" name="partakerId" id="partakerId" value="'+ response[0].partakerId +'">'+
									'<button type="submit" class="btn btn-success btn-large btn-block">  Validar</button>'+
								'</form>'+
							'</div>');
	$('#validateFormContainer').append(form);
	if(response[0].validateFlag !== 0){
		var yaRegistrado = $('<div class="hero-unit text-center"><h3>Asistente ya validad@</h3></div>');
		$('#validateFormContainer').find('.span6').children().remove();
		$('#validateFormContainer').find('.span6').append(yaRegistrado);
	}
}

function buttonModify(event){
	event.preventDefault();
	$('#modifyFormContainer').show();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').hide();
	$('#prepartakersAdicionalInfoContainer').hide();
	$('#prepartakersAdicionalInfoContainer').fadeIn();
	$('#modifyFormContainer').children().remove();


	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$.post('searchPrepartaker',  {name: name} , postButtonModify);
}

function postButtonModify(response) {
	var form = $('<form action="/modifyPrepartaker" method="POST" id="modifyForm" class="form-horizontal">'+
								'<div class="control-group">'+
									'<label for="name" class="control-label pull-right"> Nombre</label>'+
									'<div class="controls">'+
										'<input type="text" id="name" name="name" required="required" class="input-large" value="'+response[0].partakerName+'">'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label for="mail" class="control-label">  Correo</label>'+
									'<div class="controls">'+
										'<input type="email" id="mail" name="mail" required="required" class="input-large" value="'+response[0].partakerMail+'">'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label for="phone" class="control-label">  Teléfono</label>'+
									'<div class="controls">'+
										'<input type="number" id="phone" name="phone" required="required" class="input-large" value="'+response[0].partakerPhone+'">'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label for="address" class="control-label">  Dirección</label>'+
									'<div class="controls">'+
										'<input type="text" id="address" name="address" required="required" class="input-large" value="'+response[0].partakerAddress+'">'+
									'</div>'+
								'</div>'+ 
								'<input class="hidden" type="text" name="nameToChange" id="nameToChange" value="'+ response[0].partakerName +'">'+
								'<button type="submit" class="btn btn-warning btn-large btn-block">  Modificar</button>'+
							'</form>');
	$('#modifyFormContainer').append(form);
}

function buttonDelete(event){
	event.preventDefault();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').show();
	$('#prepartakersAdicionalInfoContainer').hide();
	$('#prepartakersAdicionalInfoContainer').fadeIn();
	$('#deleteFormContainer').children().remove();

	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$.post('searchPrepartaker',  {name: name} ,postButtonDelete);
}

function postButtonDelete(response){
	var form = $('<form action="/deletePrepartaker" method="POST" id="deleteForm" class="form-horizontal">'+
								'<h2>	Confirmar la eliminación de:</h2>'+
								'<h3><em>'+ response[0].partakerName +'</h3></em>'+
								'<input class="hidden" type="text" name="partakerId" id="partakerId" value="'+ response[0].partakerId +'">'+
								'<input class="hidden" type="text" name="validateFlag" id="validateFlag" value="'+ response[0].validateFlag +'">'+
								'<button type="submit" class="btn btn-danger btn-large btn-block">  Eliminar</button>'+
							'</form>');
	$('#deleteFormContainer').append(form);
	if(response[0].validateFlag !== 0){
		var alertaUsuarioValidado = $('<div class="alert alert-error">Alerta, este asistente ya está validado, será eliminado de ambas listas</div>');
		$('#deleteFormContainer').find('h2:first').before(alertaUsuarioValidado);
	}
}

function hideAddicionalPanel(){
	//Hide the panel below
	$(this).parent().fadeOut();
}

function postPrepartakersTable(response){
	var trToAppend;
	trToAppend = $("<tr>"+
								"<td class = 'nameColumn iterator' data-prepartaker-name='"+ response[0].partakerName +"'>"+ response[0].partakerName +"</td>"+
								"<td>"+ response[0].partakerMail +"</td>"+
								"<td><button class='btn  btn-success' type='button'>Validar</button></td>"+
								"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
								"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
								"</tr>");
	$('#prepartakersTable').append(trToAppend);

	for( i = 1;i < response.length;i++){
		trToAppend = $("<tr>"+
									"<td class = 'nameColumn' data-prepartaker-name='"+ response[i].partakerName +"'>"+ response[i].partakerName +"</td>"+
									"<td>"+ response[i].partakerMail +"</td>"+
									"<td><button class='btn  btn-success' type='button'>Validar</button></td>"+
									"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
									"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
									"</tr>");
		$('#prepartakersTable').append(trToAppend);
	}
}

function start(){
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#prepartakersFilterForm').on('keyup','.prepartakersFilter',prepartakersTableFilter);	
	$('#prepartakersTable').on('click','.btn-success',buttonValidate);
	$('#prepartakersTable').on('click','.btn-warning',buttonModify);
	$('#prepartakersTable').on('click','.btn-danger',buttonDelete);
	$('#prepartakersAdicionalInfoContainer').on('click','.btn-mini',hideAddicionalPanel);

	//Hide all the stuff that shouldn't be shown at first 
	$('#prepartakersAdicionalInfoContainer').hide();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').hide();

	$.post('getPrepartakersTable',postPrepartakersTable);
}

$(document).on('ready', start);