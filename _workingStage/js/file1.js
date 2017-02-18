/** ------------------------
 * 테스트 파일1
 * 
 * ------------------------ */

$(function(){
	//alert()
});

function dimmedDIV(){
	if(!$('.dimmedDiv').length) {return;}
	$('.dimmedTR').each(function(){
		var divHeight = $(this).height();
		$(this).find('.dimmedDiv, .dimmedDiv>span').height(divHeight);
	});
}

function aaa(){
	console.log('test');
}
// line in footer
// footer


