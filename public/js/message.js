/**
 * Created by Алеша on 05.06.2017.
 */
$(document).ready(function () {
    let socket = io.connect('/');
    let messages = $('#messages');
    let username,data,time ;

    socket.on('allMessages', function (data) {
        console.log(data);
        msg(data.fullName,data.hashedText,data.date,data.time)
    });
    function msg(username,message,date,time) {
        let m = `<div class="msg"> 
                    <p>
                        <span class="username">${username}</span>
                        <span class="date">${date}</span>
                        <span class="time">${time}</span>
                    </p> 
                    <div class="text_msg">${safe(message)}</div>
                 </div>`;
        messages.append(m)
            .scrollTop(messages[0].scrollHeight);
    }


    socket.on('connecting', function () {
        msgSystem('Соединение...');
    });

    socket.on('connect', function () {
        msgSystem('Соединение установленно! ');

    });
    socket.on('message', function (data) {
        console.log(data);
        msg(data.name,data.message,data.date,data.time)
    });
    /*Функция по формированию структуры сообщения на FrontEND BEGIN*/
    function msgSystem(message) {
        let m = `<div class="msg system">${safe(message)} <span class="nick"> ТЕСТ</span> </div>`;
        messages
            .append(m)
            .scrollTop(messages[0].scrollHeight);
    }
    /*END*/

    /*Функция по фильтрации сообщения от лишних символов BEGIN*/
    function safe(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'</br>');
    }
    /*END*/

    $("#message_btn").click(function () {
        let text = $("#message_text").val();
        if (text.length <= 0)
            return;
        $('#message_text').val("");
        socket.emit("message", {message: text, name: 'ТЕСТ'});
    });
    $("#message_text").keydown(function(e){
        // Enter was pressed without shift key
        if (e.keyCode == 13 && !e.shiftKey)
        {
            $('#message_btn').trigger('click');
            e.preventDefault(); // Предотвращает стандартное действие события
        }
    });
});