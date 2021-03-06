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

function tableFilter(){
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
/*
	All the button and post functions for Prepartakers
*/
function buttonValidatePrepartakers(event){
	event.preventDefault();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').show();
	$('#deleteFormContainer').hide();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#validateFormContainer').children().remove();

	var id = $(this).closest('tr').find('.nameColumn').data('prepartaker-id');
	$.post('searchPrepartaker',  {id: id} , postButtonValidatePrepartakers);
}

function postButtonValidatePrepartakers(response){
	var form = $('<div class="span5 alert alert-success">'+
								'<ul class="nav nav-list">'+
									'<li><h4>'+response[0].partakerName+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerAge+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerGender+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerMail+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerPhone+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerAddress+'</h4></li>'+
								'</ul>'+
							'</div>'+
							'<div class="span6">'+
								'<form action="/validatePrepartaker" method="POST" id="validatePrepartaker" class="form-horizontal">'+
									'<div class="control-group">'+
										'<label for="user" class="control-label pull-right"> Usuario</label>'+
										'<div class="controls">'+
											'<input type="text" id="user" name="user" required="required" class="input-large" value='+response[0].partakerMail+'>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label for="password" class="control-label">  Contraseña</label>'+
										'<div class="controls">'+
											'<input type="password" id="password" name="password" required="required" class="input-large">'+
										'</div>'+
									'</div>'+
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

function buttonModifyPrepartakers(event){
	event.preventDefault();
	$('#modifyFormContainer').show();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').hide();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#modifyFormContainer').children().remove();

	var id = $(this).closest('tr').find('.nameColumn').data('prepartaker-id');
	$.post('searchPrepartaker',  {id: id} , postButtonModifyPrepartakers);
}

function postButtonModifyPrepartakers(response) {
	var form = $('<form action="/modifyPrepartaker" method="POST" id="modifyForm" class="form-horizontal">'+
								'<div class="control-group">'+
									'<label for="name" class="control-label pull-right"> Nombre</label>'+
									'<div class="controls">'+
										'<input type="text" id="name" name="name" required="required" class="input-large" value="'+response[0].partakerName+'">'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label for="name" class="control-label pull-right"> Edad</label>'+
									'<div class="controls">'+
										'<input type="number" id="age" name="age" placeholder="Edad" required="required" min="5" max="99" class="input-large" value='+response[0].partakerAge+'>'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label for="inputGender" class="control-label">	Género</label>'+
									'<div class="controls">'+
											'<select id="gender" name="gender">'+
											'<option>	Masculino</option>'+
											'<option>	Femenino</option>'+
											'</select>'+
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

function buttonDeletePrepartakers(event){
	event.preventDefault();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').show();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#deleteFormContainer').children().remove();

	var id = $(this).closest('tr').find('.nameColumn').data('prepartaker-id');
	$.post('searchPrepartaker',  {id: id} ,postButtonDeletePrepartakers);
}

function postButtonDeletePrepartakers(response){
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
/*
	All the button and post functions for Partakers
*/
function buttonModifyPartakers(event){
	event.preventDefault();
	$('#modifyFormContainer').show();
	$('#deleteFormContainer').hide();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#modifyFormContainer').children().remove();

	var id = $(this).closest('tr').find('.nameColumn').data('prepartaker-id');
	$.post('searchPartaker',  {id: id}, postButtonModifyPartakers);
}

function postButtonModifyPartakers(response){
	var form = $('<form action="/modifyPartaker" method="POST" id="modifyPartaker" class="form-horizontal">'+
									'<div class="control-group">'+
										'<label for="user" class="control-label pull-right"> Usuario</label>'+
										'<div class="controls">'+
											'<input disabled type="text" id="user" name="user" required="required" class="input-large" value='+response[0].partakerUser+'>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label for="password" class="control-label">  Contraseña</label>'+
										'<div class="controls">'+
											'<input disabled type="text" id="password" name="password" required="required" class="input-large" value='+response[0].partakerPassword+'>'+
										'</div>'+
									'</div>'+
									'<div class="control-group">'+
										'<label for="folio" class="control-label">  Folio</label>'+
										'<div class="controls">'+
											'<input type="text" id="folio" name="folio" required="required" class="input-large" value='+response[0].partakerBaucher+'>'+
										'</div>'+
									'</div>'+
									'<input class="hidden" type="text" name="partakerId" id="partakerId" value="'+ response[0].partakerId +'">'+
									'<button type="submit" class="btn btn-warning btn-large btn-block">  Modificar</button>'+
								'</form>');
	$('#modifyFormContainer').append(form);
}

function buttonDeletePartakers(event){
	event.preventDefault();
	$('#modifyFormContainer').hide();
	$('#deleteFormContainer').show();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#deleteFormContainer').children().remove();

	var id = $(this).closest('tr').find('.nameColumn').data('prepartaker-id');
	$.post('searchPrepartaker',  {id: id}, postButtonDeletePartakers);
}

function postButtonDeletePartakers(response){
	var form = $('<form action="/deletePartaker" method="POST" id="deleteForm" class="form-horizontal">'+
								'<h2>	Confirmar la eliminación de:</h2>'+
								'<h3><em>'+ response[0].partakerName +'</h3></em>'+
								'<input class="hidden" type="text" name="partakerId" id="partakerId" value="'+ response[0].partakerId +'">'+
								'<button type="submit" class="btn btn-danger btn-large btn-block">  Eliminar</button>'+
							'</form>');
	$('#deleteFormContainer').append(form);
}

function buttonSeeCredentialPartakers(){
	$('#modifyFormContainer').hide();
	$('#deleteFormContainer').show();
	$('#adicionalInfoContainer').hide();
	$('#deleteFormContainer').children().remove();
}
/*
	All the button and post functions for messages
*/
function buttonInfoMessage(event){
	event.preventDefault();
	$('#informationFormContainer').show();
	$('#deleteFormContainer').hide();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#informationFormContainer').children().remove();

	var id = $(this).closest('tr').children(':first-child').data('prepartaker-id');
	$.post('searchPrepartaker',{id: id}, postButtonInfoMessage);
}

function postButtonInfoMessage(response){
	var form = $('<div class="container alert alert-info text-center">'+
								'<ul class="nav nav-list">'+
									'<li><h4>'+response[0].partakerName+'</h4></li><hr>'+
									'<li><h4>'+response[0].partakerMail+'</h4></li><hr>'+
								'</ul>'+
							'</div>');
	$('#informationFormContainer').append(form);
}

function buttonDeleteMessage(event){
	var $this = $(this);
	event.preventDefault();
	$('#informationFormContainer').hide();
	$('#deleteFormContainer').show();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#deleteFormContainer').children().remove();

	var id = $(this).closest('tr').children(':first-child').data('message-id');
	$.post('searchMessage',{id: id}, postButtonDeleteMessage);
}

function postButtonDeleteMessage(response){
	var form = $('<form action="/deleteMessage" method="POST" id="deleteMessageForm" class="form-horizontal">'+
								'<h2>	Confirmar la eliminación del mensaje:</h2>'+
								'<h3><em>'+ response[0].mensaje +'</h3></em>'+
								'<input class="hidden" type="text" name="messageId" id="messageId" value="'+ response[0].messageId +'">'+
								'<button type="submit" class="btn btn-danger btn-large btn-block">  Eliminar</button>'+
							'</form>');
	$('#deleteFormContainer').append(form);
}
/*
	All the button and post functions for messages
*/
function buttonModifyEcho(event){
	event.preventDefault();
	$('#modifyFormContainer').show();
	$('#deleteFormContainer').hide();
	$('#adicionalInfoContainer').hide();
	$('#adicionalInfoContainer').fadeIn();
	$('#modifyFormContainer').children().remove();

	var id = $(this).closest('tr').children(':first-child').data('echo-id');
	$.post('searchEcho',  {id: id}, postButtonModifyEcho);
}

function postButtonModifyEcho(response){
	var form = $('<form action="/modifyEcho" method="POST" id="modifyEcho" class="form-horizontal">'+
									'<div class="control-group">'+
										'<label for="user" class="control-label pull-right"> Echo</label>'+
										'<div class="controls">'+
											'<textarea maxlength="140" type="text" id="echo" name="echo" required="required">'+response[0].echo+'</textarea>'+
										'</div>'+
									'</div>'+
									'<input class="hidden" type="text" name="echoId" id="echoId" value="'+ response[0].echoId +'">'+
									'<button type="submit" class="btn btn-warning btn-large btn-block">  Modificar</button>'+
								'</form>');
	$('#modifyFormContainer').append(form);
}

function buttonDeleteEcho(event){
	var flag = confirm("Seguro que deseas eliminarlo?");
	if(flag){
		var id = $(this).closest('tr').children(':first-child').data('echo-id');
		$.post('deleteEcho',  {id: id}, postButtonDeleteEcho);
	}
}

function postButtonDeleteEcho(response){
	location.reload();
}

function hideAddicionalPanel(){
	//Hide the panel below
	$(this).parent().fadeOut();
}

function postGetPrepartakersTable(response){
	var trToAppend;
	trToAppend = $("<tr>"+
								"<td class = 'nameColumn iterator' data-prepartaker-name='"+response[0].partakerName +"' data-prepartaker-id='"+ response[0].partakerId +"'>"+ response[0].partakerName +"</td>"+
								"<td>"+ response[0].partakerMail +"</td>"+
								"<td><button class='btn  btn-success' type='button'>Validar</button></td>"+
								"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
								"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
								"</tr>");
	$('#prepartakersTable').append(trToAppend);

	for( i = 1;i < response.length;i++){
		trToAppend = $("<tr>"+
									"<td class = 'nameColumn' data-prepartaker-name='"+response[i].partakerName +"' data-prepartaker-id='"+ response[i].partakerId +"'>"+ response[i].partakerName +"</td>"+
									"<td>"+ response[i].partakerMail +"</td>"+
									"<td><button class='btn  btn-success' type='button'>Validar</button></td>"+
									"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
									"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
									"</tr>");
		$('#prepartakersTable').append(trToAppend);
	}
}

function postGetPartakersTable(response){
	var trToAppend;
	trToAppend = $("<tr>"+
								"<td class = 'nameColumn iterator' data-prepartaker-name='"+response[0].partakerName +"' data-prepartaker-id='"+ response[0].partakerId +"'>"+ response[0].partakerName +"</td>"+
								"<td>"+ response[0].partakerMail +"</td>"+
								"<td><button class='btn  btn-warning' type='button'>Consultar/Modificar</button></td>"+
								"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
								"<td><form action='credentials' method='POST' target='_blank'>"+
								"<input class='hidden' type='text' name='partakerId' id='partakerId' value='"+ response[0].partakerId +"'>"+
								"<button type='submit' class='btn  btn-info' type='button'>Ver Credencial</button></form></td>"+
								"</tr>");
	$('#partakersTable').append(trToAppend);
	for( i = 1;i < response.length;i++){
		trToAppend = $("<tr>"+
									"<td class = 'nameColumn' data-prepartaker-name='"+response[i].partakerName +"' data-prepartaker-id='"+ response[i].partakerId +"'>"+ response[i].partakerName +"</td>"+
									"<td>"+ response[i].partakerMail +"</td>"+
									"<td><button class='btn  btn-warning' type='button'>Consultar/Modificar</button></td>"+
									"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
									"<td><form action='credentials' method='POST' target='_blank'>"+
									"<input class='hidden' type='text' name='partakerId' id='partakerId' value='"+ response[i].partakerId +"'>"+
									"<button type='submit' class='btn  btn-info' type='button'>Ver Credencial</button></form></td>"+
									"</tr>");
		$('#partakersTable').append(trToAppend);
	}
}

function postGetMessagesTable(response){
	var trToAppend;
	trToAppend =	$("<tr>"+
								"<td class='iterator' data-message-id="+response[response.length-1].messageId+" data-prepartaker-id="+ response[response.length-1].eventPartakerId +">"+ response[response.length-1].mensaje +"</td>"+
								"<td><button class='btn  btn-info' type='button'>Ver remitente</button></td>"+
								"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
								"</tr>");
	$('#messagesTable').append(trToAppend);
	for(i = response.length-2;i >= 0;i--){
		trToAppend =	$("<tr>"+
									"<td data-message-id="+response[i].messageId+" data-prepartaker-id="+ response[i].eventPartakerId +">"+ response[i].mensaje +"</td>"+
									"<td><button class='btn  btn-info' type='button'>Ver remitente</button></td>"+
									"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
									"</tr>");
		$('#messagesTable').append(trToAppend);
	}
}

function postGetEchosTable(response){
	var trToAppend;
	trToAppend =	$("<tr>"+
								"<td class='iterator' data-echo-id="+ response[response.length-1].echoId +">"+ response[response.length-1].echo +"</td>"+
								"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
								"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
								"</tr>");
	$('#echosTable').append(trToAppend);
	for(i = response.length-2;i >= 0;i--){
		trToAppend =	$("<tr>"+
									"<td data-echo-id="+response[i].echoId+" >"+ response[i].echo +"</td>"+
									"<td><button class='btn  btn-warning' type='button'>Modificar</button></td>"+
									"<td><button class='btn  btn-danger' type='button'>Eliminar</button></td>"+
									"</tr>");
		$('#echosTable').append(trToAppend);
	}
}

function start(){
	//variables
	var urlPathname = window.location.pathname;

	//Add all the listeners
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#adicionalInfoContainer').on('click','.btn-mini',hideAddicionalPanel);
	$('#filterForm').on('keyup','.prepartakersFilter',tableFilter);

	//Prepartakers table button listeners
	$('#prepartakersTable').on('click','.btn-success',buttonValidatePrepartakers);
	$('#prepartakersTable').on('click','.btn-warning',buttonModifyPrepartakers);
	$('#prepartakersTable').on('click','.btn-danger',buttonDeletePrepartakers);

	//Partakers table button listeners
	$('#partakersTable').on('click','.btn-warning',buttonModifyPartakers);
	$('#partakersTable').on('click','.btn-danger',buttonDeletePartakers);
	$('#partakersTable').on('click','.btn-info',buttonSeeCredentialPartakers);

	//Messages table button listeners
	$('#messagesTable').on('click','.btn-info',buttonInfoMessage);	
	$('#messagesTable').on('click','.btn-danger',buttonDeleteMessage);

	//Echos table button listeners
	$('#echosTable').on('click','.btn-warning',buttonModifyEcho);	
	$('#echosTable').on('click','.btn-danger',buttonDeleteEcho);

	//Hide all the stuff that shouldn't be shown at first 
	$('#adicionalInfoContainer').hide();
	$('#modifyFormContainer').hide();
	$('#validateFormContainer').hide();
	$('#deleteFormContainer').hide();

	switch(urlPathname){
		case '/organiserPanel':			
			$.post('getPrepartakersTable',postGetPrepartakersTable);
			$('#organiserMainNav').find('li').removeClass('active');
			$('#organiserMainNav').find('li:first').addClass('active');
		break;
		case '/organiserPanelRecords':
			$.post('getPartakersTable',postGetPartakersTable);
			$('#organiserMainNav').find('li').removeClass('active');
			$('#organiserMainNav').find('li:first').next().addClass('active');
		break;
		case '/organiserPanelMessages':
			$.post('getMessagesTable',postGetMessagesTable);
			$('#organiserMainNav').find('li').removeClass('active');
			$('#organiserMainNav').find('li:last').prev().addClass('active');
		break;
		case '/organiserPanelEchos':
			$.post('getEchosTable',postGetEchosTable);
			$('#organiserMainNav').find('li').removeClass('active');
			$('#organiserMainNav').find('li:last').addClass('active');
		break;
	}
}

$(document).on('ready', start);