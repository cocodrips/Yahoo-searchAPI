$(document).ready(function() {
	$(".refresh-button-link").on("click", function() {
		$(this).children("form")[0].submit();
	});
	$(".delete-button-link").on("click", function() {
		$(this).children("form")[0].submit();
	});
	$(".plate-delete-button-link").on("click", function() {
		if(window.confirm('You delete your plate')){
			$("#trash-button").submit();
		}
	});

	$(".plate-edit-button").on("click", function() {
		rename = window.prompt('Input new name:','new name')
		if(rename){
			$("#rename-input").val(rename);
			$("#edit-button").submit();
		}
	});

	$(".add-source-button").on("click", function() {
		$("#add-source")[0].submit();
	});

	$(".add-bug-by-bookmarklet-button").on("click", function() {
		$("#add-bug-by-bookmarklet")[0].submit();
	});
});