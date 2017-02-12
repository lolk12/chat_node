$(document).ready(function () {
    var a;
    var socket = io.connect('http://localhost:8008');
    var messages = $("#messages");
    var message_txt = $("#message_text")
    var name =  'Анон_' + (Math.round(Math.random() * 10000));
    $('.chat .nick').text(name);
    var time,date;
    socket.on('message',function(data) {

        time = data.time;
        date = data.date;
    });

    function msg(nick, message) {
        var m = '<div class="msg">' +
            '<p class="msg_data"> <span class="user">' + safe(nick) + '</span><span class="date">'+date+'</span> <span class="time">'+time+'</span></p>'
            + '<div class="text_msg">' +safe(message) +'</div>'+
            '</div>';
        messages
            .append(m)
            .scrollTop(messages[0].scrollHeight);
    }

    function msg_system(message) {
        var m = '<div class="msg system">' + safe(message) +  '<span class="nick"> </span> </div>';
        $('.nick').text(name);
        messages
            .append(m)
            .scrollTop(messages[0].scrollHeight);
    }
    socket.on('connecting', function () {
        msg_system('Соединение...');
    });

    socket.on('connect', function () {
        msg_system('Соединение установленно! ');
        socket.emit('eventServer', name);

    });
    socket.on('eventClient',function(data) {
        messages
            .append('<div class="msg"><span class="userNew">Новый пользователь: '+data+'</span> </div>')
            .scrollTop(messages[0].scrollHeight);
    });
    socket.on('message', function (data) {
        msg(data.name, data.message);
        message_txt.focus();
    });


    

    $("#message_btn").click(function () {
        var text = $("#message_text").val();
        if (text.length <= 0)
            return;
        message_txt.val("");
        socket.emit("message", {message: text, name: name});
    });

    function safe(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    $( "#message_text" ).keydown(function( event ) {
        if ( event.which == 13 ) {
            $('#message_btn').trigger('click');
            $('#message_text').val('');
        }

    });
});