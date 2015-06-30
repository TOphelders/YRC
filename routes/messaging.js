module.exports = function(app, io, db) {
  var messages = db.get('messages');
  var users = db.get('users');
  var msg_model = require('../models/message_model.js')(messages);
  var usr_model = require('../models/user_model.js')(users);

  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var reply_data = [];

    // After documents were found, get the correct username for each one
    var found = function(data) {
      return data.reduce(function(prev, doc, inc) {
        return prev.then(function(user) {
          reply_data.push(data[inc]);
          reply_data[inc].username = user.username;
          return usr_model.find(doc.user_id);
        });
      }, usr_model.find(data[0].user_id));
    };

    // After last promise succeeds, send response
    var success = function() {
      res.json({
        success: true,
        data: reply_data,
        message: null
      });
    };

    // An error occurred either while loading messages or getting usernames
    var failure = function(err) {
      console.log(err.code + ': ' + err.message);
      res.json({
        success: false,
        data: null,
        message: 'Unable to load past messages.'
      });
    };

    if (start && end) msg_model.find([start, end])
      .then(found)
      .then(success, failure);
    else msg_model.find()
      .then(found)
      .then(success, failure);
  });

  app.post('/message', function(req, res) {
    var body = req.body;
    var username = body.username;
    var data = {
      user_id: body.id,
      content: body.content
    };

    msg_model.create(data)
      .then(function(doc) {
        doc.username = username;
        io.emit('message posted', doc);
        res.json({
          success: true,
          data: null,
          message: 'Message successfully sent.'
        });
      }, function(err) {
        console.log(err.code + ': ' + err.message);
        res.json({
          success: false,
          data: null,
          message: 'Oops! Something went wrong when sending your message, wait for a second and try again.'
        });
      });
  });

  app.get('/message/:id', function(req, res) {
    var id = req.params.id;
    var reply_data;

    msg_model.find_by_id(id)
      .then(function(data) {
        reply_data = data;
        return usr_model.find(data.user_id);
      })
      .then(function(user)) {
        reply_data.username = user.username;

        res.json({
          success: true,
          data: reply_data,
          message: null
        });
      }, function(err) {
        console.log(err.code + ': ' + err.message);
        res.json({
          success: false,
          data: null,
          message: 'Unable to find message: ' + id + '.'
        });
      });
  });

  app.put('/message/:id', function(req, res) {
    var id = req.params.id;
    var body = req.body;

    msg_model.update(id, body.edit)
      .then(function() {
        res.json({
          success: true,
          data: null,
          message: 'Successfully updated message: ' + id + '.'
        });
      }, function(err) {
        console.log(err.code + ': ' + err.message);
        res.json({
          success: false,
          data: null,
          message: 'There was an error trying to update message: ' + id + '.'
        });
      });
  });

  app.delete('/message/:id', function(req, res) {
    var id = req.params.id;

    msg_model.remove(id)
      .then(function() {
        res.json({
          success: true,
          data: null,
          message: 'Successfully deleted message ' + id + '.'
        });
      }, function(err) {
        console.log(err.code + ': ' + err.message);
        res.json({
          success: false,
          data: null,
          message: 'Something went wrong trying to delete message: ' + id + '.'
        });
      });
  });
}
