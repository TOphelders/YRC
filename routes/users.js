module.exports = function(app, io, cols) {
  var usr_model = require('../models/user_model.js')(cols.users);

  app.post('/user', function(req, res) {
    var body = req.body;
    var data = {
      username: body.username,
      password: body.password,
      email: body.email,
    };

    var success = function() {
      res.json({
        success: true,
        data: null,
        message: 'User successfully created.'
      });
    }

    usr_model.create(data)
      .then(success, fail(res, 'The user could not be created.'));
  });

  app.get('/user/:identity', function(req, res) {
    var identity = req.params.identity;

    var success = function(user) {
      res.json({
        success: true,
        data: user,
        message: null
      });
    };

    usr_model.find(identity)
      .then(success, fail(res, 'User: ' + identity + ' could not be found or does not exist, try checking your spelling.'));
  });

  app.put('/user/:identity', function(req, res) {
    var identity = req.params.identity;
    var body = req.body;
    var data = {};
    Object.keys(body).forEach(function(element, key) {
      if (['username', 'password', 'email'].includes(key)) data[key] = element;
    });

    var success = function(user) {
      res.json({
        success: true,
        data: null,
        message: 'User: ' + identity + ' successfully updated'
      });
    };

    usr_model.update(identity, data)
      .then(success, fail(res, 'User: ' + identity + ' could not be updated or does not exist, try checking your spelling.'));
  });

  app.delete('/user/:identity', function(req, res) {
    var identity = req.params.identity;

    var success = function(user) {
      res.json({
        success: true,
        data: null,
        message: 'User: ' + identity + ' successfully deleted'
      });
    };

    usr_model.remove(identity)
      .then(success, fail(res, 'User: ' + identity + ' could not be deleted or does not exist'));
  });
}

function fail(res, message) {
  return function(err) {
    console.log(err.code + ': ' + err.message);
    res.json({
      success:false,
      data: null,
      message: message
    });
  };
}
