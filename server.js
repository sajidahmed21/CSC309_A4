var express = require('express');
var app = express();

app.use(express.static('public'));


/* page routing -----------------------------------------------------*/
app.get('/', function (req, res) {
  
});


/* server start up --------------------------------------------------*/
app.listen(9090, function () {
  console.log('listening on port 9090');
});