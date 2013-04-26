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
	var nombre = $('.nameColumn').filter('.hi').text();
	console.log(nombre);
	console.log($('.nameColumn').filter('.hi').parent().next().children(':first-child').text());
}

$(document).ready(function(){
	$('.sidebar').on('click','li',changeContainerPanel);
	$('#prepartakersFilterForm').on('keyup','.prepartakersFilter',prepartakersTableFilter)
})