let express = require('express')
const bodyParser = require('body-parser');
let app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req,res){
  res.sendfile(__dirname + '/views/index.html');
})
app.post('/login',function(req,res){
  console.log('ПРИШЛО');
})



app.listen(8080,function(){
  console.log('JOB');
})
