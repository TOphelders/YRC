var config = require(__dirname + '/config.json');
var db = require('monk')(config.host + '/' + config.dbname, config.server_options);

var cols = {};
config.collections.forEach(function(col) {
  cols[col] = db.get(col);
});

module.exports = function(app, io) {
  messenger = require(__dirname + '/messenger.js')(io, cols);
  require(__dirname + '/http_messaging.js')(app, messenger);

  io.on('connection', function(socket) {
    //Notify of new connections to everyone already connected
    socket.broadcast.emit('user-connected');
    require(__dirname + '/socket_messaging.js')(socket, messenger);
  });
};
