var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

//Set up middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//Import all routing
require(__dirname + '/routes/routes.js')(app, io);

//Error handling definitions
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

//Initiate the server
var server = http.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
