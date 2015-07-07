module.exports = function(app, io, cols) {
  var msg_model = require('../models/message_model.js')(cols.messages);
  var usr_model = require('../models/user_model.js')(cols.users);

  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var reply_data = [];

    // After documents were found, get the correct username for each one
    var found = function(data) {
      return data.reduce(function(prev, doc, inc) {
        return prev.then(function(user) {
          data[inc].username = user.username;
          reply_data.push(data[inc]);
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
    var failure = fail(res, 'Unable to load past messages.');

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

    var success = function(doc) {
      doc.username = username;
      io.emit('message posted', doc);
      res.json({
        success: true,
        data: null,
        message: 'Message successfully sent.'
      });
    };

    msg_model.create(data)
      .then(success, fail(res, 'Oops! Something went wrong when sending your message, wait for a second and try again.'));
  });

  app.get('/message/:id', function(req, res) {
    var id = req.params.id;
    var reply_data;

    var success = function(user) {
      reply_data.username = user.username;
      res.json({
        success: true,
        data: reply_data,
        message: null
      });
    };

    msg_model.find_by_id(id)
      .then(function(data) {
        reply_data = data;
        return usr_model.find(data.user_id);
      })
      .then(success, fail(err, 'Unable to find message: ' + id + '.'));
  });

  app.put('/message/:id', function(req, res) {
    var id = req.params.id;
    var body = req.body;

    var success = function() {
      res.json({
        success: true,
        data: null,
        message: 'Successfully updated message: ' + id + '.'
      });
    };

    msg_model.update(id, body.edit)
      .then(success, fail(res, 'There was an error trying to update message: ' + id + '.'));
  });

  app.delete('/message/:id', function(req, res) {
    var id = req.params.id;

    var success = function() {
      res.json({
        success: true,
        data: null,
        message: 'Successfully deleted message ' + id + '.'
      });
    };

    msg_model.remove(id)
      .then(success, fail(res, 'Something went wrong trying to delete message: ' + id + '.'));
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
