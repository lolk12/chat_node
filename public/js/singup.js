/**
 * Created by Алеша on 06.06.2017.
 */
$(document).ready(function () {

    let socket = io.connect('/');
    $('input[type="button"]').click(function () {
        let formInput = $('input').map(function () {
            return this.text = '';
        });
        let valInput = {
            firstName : formInput.prevObject[0].value,
            lastName : formInput.prevObject[1].value,
            email : formInput.prevObject[2].value,
            vatin : formInput.prevObject[3].value,
            password : formInput.prevObject[4].value,
        };
        console.log(valInput);
        socket.emit('user', valInput);

    })
});