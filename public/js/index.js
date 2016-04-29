function filterInput(url){
	if (!url) {
	    alert('请输入要分析的网站url');
	    return;
	}

	if($('#tfile')[0].files.length === 0){
		alert('请选择要分析的文件');
	    return;
	}

	if(/^www/.test(url)) {
	    url = 'http://' + url;
	}
	
	var reader = new FileReader();

	reader.onload = function(e) {
	  var text = reader.result;
	  fetchUrl(url, reader.result)
	}

	reader.readAsText($('#tfile')[0].files[0], 'UTF-8');
}

function fetchUrl(url, text){
	$.post('/fetchUrl', {url: url, text: text}).then(function(resp){
		var res = resp.res;
		$('#cover-rate').html(resp.coverRate);


		var tmpl = _.template($('#tableLineTmpl').html());

		var tbody = res.reduce(function(memo, item){
			return memo + tmpl(item);
		}, '');

		$('#result-tbody').html(tbody);

		$('#content').show();
	})
}

function handleUserIpt(){
	function onInput(){
		var url = $('#stext').val();
		filterInput(url);
	}
	$('#sbtn').on('click', onInput);
	$('#stext').on('keydown', function(e){
		if(e.keyCode === 13){
			onInput();
		}
	})
}

$(function(){
	handleUserIpt();
})