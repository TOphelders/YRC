var fs = require('fs');
var config = require(__dirname + '/config.json');
var db = require('monk')(config.host + '/' + config.dbname, config.server_options);

var cols = {};
config.collections.forEach(function(col) {
  cols[col] = db.get(col);
});

module.exports = function(app, io) {
  var handlerfiles = fs.readdirSync(__dirname + '/handlers');
  var handlers = {};

  // Import HTTP based routing
  handlerfiles.forEach(function(filename) {
    var handler = require(__dirname + '/handlers/' + filename)(io, cols);
    handlers[filename] = handler;

    var route = __dirname + '/http_' + filename;
    require(route)(app, handler);
  });

  // Import socket based routing
  io.on('connection', function(socket) {
    //Notify of new connections to everyone already connected
    socket.broadcast.emit('user-connected');

    handlerfiles.forEach(function(filename) {
      var route = __dirname + '/socket_' + filename;
      require(route)(socket, handlers[filename]);
    });
  });
};
