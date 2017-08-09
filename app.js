let express = require('express');
let session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
const dateTime = require('./myModules/time');
const mongoose = require('./myModules/db/connect').connect;
let ObjectId = require('mongodb').ObjectId;
let AES = require('crypto-js/AES');
let app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
let User = require('./myModules/db/user.js').User;
let Message = require('./myModules/db/message.js').Message;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(__dirname +'/public'));
app.use(cookieParser());
let MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'keyboard cat',
    key: 'sid',
    store: new MongoStore({
        url: 'mongodb://localhost/testDB',
    })
}));
let username = '';
let userIdSession;
app.get('/', function(req, res,next) {
    userIdSession = req.session.userID;
    console.log(userIdSession);
    if(userIdSession){
        User.find({_id: ObjectId(req.session.userID)},function (err,user) {
            username = user[0].firstName + ' ' + user[0].lastName;
        });
        res.sendFile(__dirname + '/views/index.html');
        return ;
    }else{
        res.redirect('/singin');
        return ;
    }

});
app.get('/singin', function (req,res,next) {
    if(!req.session.userID){
        res.sendfile(__dirname + '/public/html/singin.html');
        return ;
    }else{
        res.redirect('/');
        return ;
    }
});
app.get('/singup', function (req,res,next) {
    res.sendfile(__dirname + '/public/html/singup.html');
});
app.get('/logout',function (req,res) {
    req.session.userID = undefined;
    res.redirect('/singin');
});
io.sockets.on('connection', function (client) {
    Message.find({},function (err, message) {
        let hash,hashTrue;
        let dataMessage = {};
        console.log(message[4]);
        for(let i in message){
            hash= ''; hashTrue = '';
            hash = AES.decrypt(message[i].hashedText, message[i].salt);
            hashTrue = '';
            hash = hash.toString();
            for(let z = 0; z<=hash.length; z++){
                if(z % 2){
                    hashTrue += hash[z];
                }
            }
            message[i].hashedText = hashTrue;
            client.emit('allMessages',message[i]);
        }
    });
    client.on('user',function (data) {


    });

    app.post('/singin',function (req,res,next) {
        User.find({email: req.body.email},function (err, user) {
            if (err) return console.error(err);
            if(!user[0]){res.sendStatus(403); return ;}
            else{
                let hash = AES.decrypt(user[0].hashedPassword, user[0].salt);
                let hashTrue = '';
                hash = hash.toString();
                for(let i = 0; i<=hash.length; i++){
                    if(i % 2){
                        hashTrue += hash[i];
                    }
                }
                if(hashTrue === req.body.password){
                    console.log(user[0].firstName + ' ' + user[0].lastName + ' : Вошел в чат');
                    req.session.userID = user[0]._id;
                    res.redirect('/');
                }else{
                    console.log('false');
                    res.sendStatus(403);
                    return ;
                }
            }

        })
    });
    app.post('/singup',function (req,res) {
        let user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            vatin: req.body.vatin,
            password: req.body.password,
        });


        user.save(function (err,user,affected) {
            if (err){

                res.sendStatus(403);
                return console.error(err);
            }else{
                res.redirect('/');
                req.session.userID = user._id;
            }
        });
    });
    client.on('message', function (message) {
        try {
            message.time = timeS(); // Записываем время сервера
            message.date = dateS(); // Записываем дату сервера
            message.name = username;
            let messageDB = new Message({
                userID: userIdSession,
                text: message.message,
                date: message.date,
                time: message.time,
                fullName: username
            });
            messageDB.save(function (err,message,affected) {
                if (err){
                    console.error(err);
                }
            });
            client.emit('message', message);
            client.broadcast.emit('message', message);
        } catch (e) {
            console.error(e);
            client.disconnect();
        }
    });



});









server.listen(1212,function () {
  console.log('Server Job');
});






////БЛОК ПОЛУЧЕНИЯ ВРЕМЕНИ СЕРВЕРА////
let dateS = dateTime.dateTime.dateS;
let timeS = dateTime.dateTime.timeS;
////БЛОК ПОЛУЧЕНИЯ ВРЕМЕНИ СЕРВЕРА END////
