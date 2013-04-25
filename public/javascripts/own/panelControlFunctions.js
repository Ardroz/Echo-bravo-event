function changeSidebarActive(){
	$(this).closest('.sidebar').find('.active').removeClass('active');
	$(this).addClass('active');
}

function expandRowFluid(clickedLiName){
	var identificador = '#'+ clickedLiName;
	console.log('entre ' + clickedLiName + identificador);
	
	$('.row-fluid').fadeOut(0,'swing', function(){
		$('.container-fluid').find(identificador).removeClass('hidden');
		$('.container-fluid').find(identificador).fadeIn();
	});
}

function changeRowFluidPanel(event){
	event.stopPropagation();
	event.preventDefault();
	var clickedLi = +$(this).data('row-code');
	var clickedLiName = $(this).data('row-name');
	expandRowFluid(clickedLiName);
}

$('document').ready(function(){
	$('.sidebar').on('click','li',changeSidebarActive);
	$('.sidebar').on('click','li',changeRowFluidPanel);
})