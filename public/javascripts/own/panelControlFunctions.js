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

	if(text == ''){
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
		};

		$('.nameColumn').filter('.iterator').removeClass('iterator');
		$('.nameColumn:first').addClass('iterator');
	}
}

function buttonValidate(){
	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$('#prepartakersAdicionalInfoContainer').fadeIn();
}

function buttonModify(event){
	event.preventDefault();
	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$('#prepartakersAdicionalInfoContainer').hide();
	$('#prepartakersAdicionalInfoContainer').fadeIn();
	$('#modifyFormContainer').children().remove();
	$.post('searchPrepartaker',  {name: name} ,function(response) {
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
	});
}

function buttonDelete(){
	var name = $(this).closest('tr').find('.nameColumn').data('prepartaker-name');
	$('#prepartakersAdicionalInfoContainer').fadeIn();
}

function hideAddicionalPanel(){
	$(this).parent().fadeOut();
}

$(document).ready(function(){
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#prepartakersFilterForm').on('keyup','.prepartakersFilter',prepartakersTableFilter);	
	$('#prepartakersTable').on('click','.btn-success',buttonValidate);
	$('#prepartakersTable').on('click','.btn-warning',buttonModify);
	$('#prepartakersTable').on('click','.btn-danger',buttonDelete);
	$('#prepartakersAdicionalInfoContainer').on('click','.btn-mini',hideAddicionalPanel);
	
	$.post('getPrepartakersTable',function(response) {
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
	});
});