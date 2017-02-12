const PORT = 8008;

var options = {
//    'log level': 0
};
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server, options);
const mongodb = require('mongodb').MongoClient;
const objID = require('mongodb').ObjectID;
let db;

mongodb.connect('mongodb://localhost:27017/testDB',function(err,database){
    if(err){
        return console.log(err);
    }
    db = database;
    server.listen(PORT,function(){
        console.log("server Job");
    });

});



app.use('/static', express.static(__dirname + '/static'));
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function (client) {



    ////БЛОК ПОЛУЧЕНИЯ ВРЕМЕНИ СЕРВЕРА////
    let timeS = function() {
        let Data = new Date();
        let Hour,Minutes,Seconds;
        if(Data.getHours()<10){
            Hour = '0' + Data.getHours();
        }else {Hour = Data.getHours();}
        if(Data.getMinutes()<10){
            Minutes = '0' + Data.getMinutes();
        }else{Minutes = Data.getMinutes();}
        if(Data.getSeconds()<10){
            Seconds = '0' + Data.getSeconds();
        }else{Seconds = Data.getSeconds()}
        var timeF = Hour+':'+Minutes+':'+ Seconds;
        return timeF;
    }
    let dateS = function() {
        let date = new Date();
        date = date.toDateString();
        return date;
    };
    ////БЛОК ПОЛУЧЕНИЯ ВРЕМЕНИ СЕРВЕРА END////


    //// Блок регистрации ////
    client.on('reg',function (data) {
        let overlap;
        db.collection('user').find().toArray(function (err,docs) {
            if(err){
                console.error(err);
                return res.sendStatus(500);
            }
            for(let key of docs){
                if(key.login !== data.login){
                    overlap = false;
                }else{
                    overlap = true;
                    break;
                }

            }
            if(overlap !== true){
                db.collection('user').insert(data,function (err,result) {
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                });
                client.emit('overlap', {massage: 'Успешная регестрация', status: '200'});
            }else{
                client.emit('overlap',{massage: 'Пользователь с таким именем уже есть', status : '403'} );
            }


        })


    });
    //// Блок регистрации END////


    let name;
    client.on('eventServer', function (data) {
        name = data;
        client.broadcast.emit('eventClient', name);
    });



    client.on('message', function (message) {
        message.time = timeS();
        message.date = dateS();
        try {
            client.emit('message', message);
            client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });

});
