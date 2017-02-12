$(document).ready(function() {
	var h,a;
    h = $(".wind-chat").css("height"); 
    h = parseInt(h)  / 100 * 72; a = h;
    h = h + "px";
    $(".messages").css("height", h);
    $("#message_text").css("height",a / 100 * 14 + "px")
    $("#message_btn").css("height",a / 100 *  + "px")


   	
});