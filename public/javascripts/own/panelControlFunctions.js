function changeSidebarActive(){
	$(this).closest('.sidebar').find('.active').removeClass('active')
	$(this).addClass('active');
}

function changeRowFluidPanel(event){
	event.stopPropagation();
	event.preventDefault();
	var clickedLi = +$(this).data('row-name');
	switch(clickedLi){
		case 1:
			$(this).closest('.row-fluid').fadeOut();
			$(this).closest('.container-fluid').find('.row-fluid').addClass('hidden');
			$(this).closest('.container-fluid').find('#list').removeClass('hidden');
			$(this).closest('.container-fluid').find('#list').fadeIn();
		break;
		case 2:
		  $(this).closest('.row-fluid').fadeOut();
		  $(this).closest('.container-fluid').find('.row-fluid').addClass('hidden');
			$(this).closest('.container-fluid').find('#search').removeClass('hidden');
			$(this).closest('.container-fluid').find('#search').fadeIn();
		break;
		case 3:
			$(this).closest('.row-fluid').fadeOut();
			$(this).closest('.container-fluid').find('.row-fluid').addClass('hidden');
			$(this).closest('.container-fluid').find('#delete').removeClass('hidden');
			$(this).closest('.container-fluid').find('#delete').fadeIn();
		break;
		default:
  }
}

$('document').ready(function(){
	$('.sidebar').on('click','li',changeSidebarActive);
	$('.sidebar').on('click','li',changeRowFluidPanel);
})