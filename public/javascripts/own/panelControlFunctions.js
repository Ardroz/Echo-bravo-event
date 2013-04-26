
$(document).ready(function(){
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#prepartakersFilterForm').on('keyup','.prepartakersFilter',prepartakersTableFilter);
})

function changeContainerPanel(event){
	event.preventDefault();
	event.stopPropagation();
	var identifier = '#'+ $(this).data('li-name');
	$('.row-fluid').find('.container').hide();
	$('.row-fluid').find('.container').removeClass('hidden');
	$('.row-fluid').find(identifier).slideDown(1000);

	//This part is for the sidebar .active change
	$(this).closest('.sidebar').find('.active').removeClass('active');
	$(this).addClass('active');
}

function prepartakersTableFilter(){
	var iteratorRow = $('.nameColumn').filter('.iterator').parent();
	var name = $('.nameColumn').filter('.iterator').data('prepartaker-name').toLowerCase();
	var text = $(this).val().toLowerCase();	
	var tableLength = $('.nameColumn').length;

	if(text == ''){
		$('.nameColumn').parent().slideDown();
	}else{
		if(name == text){
			iteratorRow.slideDown();	
		}else{
			iteratorRow.slideUp();	
		}

		for (var i = 2; i <= tableLength; i++) {
			name = $('.nameColumn').filter('.iterator').parent().next().children(':first-child').data('prepartaker-name').toLowerCase();
			iteratorRow = $('.nameColumn').filter('.iterator').parent().next().children(':first-child').parent();
			//Comparacion
			if(name == text){
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