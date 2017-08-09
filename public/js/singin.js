/**
 * Created by Алеша on 06.06.2017.
 */
$(window).ready(function () {
    let socket = io.connect('/');
    let userData = {};
    $('input[type="button"]').click(function () {
        userData.email = $('input[type="text"]').val();
        userData.password = $('input[type="password"]').val();
        socket.emit('singup', userData);
    });
    socket.on('singup',function (data) {
        if(data.status){
            window.location.href = "/#public_chat";
        }
    })
});