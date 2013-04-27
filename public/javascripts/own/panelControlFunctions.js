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

$(document).ready(function(){
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#prepartakersFilterForm').on('keyup','.prepartakersFilter',prepartakersTableFilter);
	
	$.post('getPrepartakersTable',function(data) {
		var trToAppend;
		trToAppend = $("<tr>"+
									"<td class = 'nameColumn iterator' data-prepartaker-name='"+ data[0].partakerName +"'>"+ data[0].partakerName +"</td>"+
									"<td>"+ data[0].partakerMail +"</td>"+
									"<td>"+ data[0].partakerPhone +"</td>"+
									"<td>"+ data[0].partakerAddress+"</td>"+
									"</tr>");
		$('#prepartakersTable').append(trToAppend);

  	for( i = 1;i < data.length;i++){
			trToAppend = $("<tr>"+
										"<td class = 'nameColumn' data-prepartaker-name='"+ data[i].partakerName +"'>"+ data[i].partakerName +"</td>"+
										"<td>"+ data[i].partakerMail +"</td>"+
										"<td>"+ data[i].partakerPhone +"</td>"+
										"<td>"+ data[i].partakerAddress+"</td>"+
										"</tr>");
			$('#prepartakersTable').append(trToAppend);
  	}
  	console.log(data[0].partakerName);
  	console.log(data[1].partakerName);
	});
})