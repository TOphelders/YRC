var fs = require('fs');
var config = require(__dirname + '/config.json');
var db = require('monk')(config.host + '/' + config.dbname);

module.exports = function(app, io) {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file === 'routes.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js') return;

    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app, io, db);
  });
}
