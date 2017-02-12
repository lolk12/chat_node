$(document).ready(function () {
    let socket = io.connect('http://localhost:8008');
    let userData = {};

    $('#inSyte').click(function () {
        // if($('#login').val().length >= 4){
        //
        // }
        // if($('#pass').val().length >= 6){
        //     data.pass = $('#pass').val();
        // }
        userData.login = $('#login').val();
        userData.pass = $('#pass').val();

        socket.emit('reg',userData);
    });

    socket.on('overlap',function (data) {
        alert(data.massage);
            $('.wind-chat').load('chat.html');
    });

});
