module.exports = function(app, io, db) {
  var messages = db.get('messages');
  var users = db.get('users');
  var model = require('../models/message_model.js')(messages);

  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);

    var success = function(data) {
      res.json({
        success: true,
        data: data,
        message: null
      });
    };

    var failure = function(err) {
      console.log(err.code + ': ' + err.message);
      res.json({
        success: false,
        data: null,
        message: 'Unable to load past messages.'
      });
    };

    if (start && end) model.find([start, end]).then(success, failure);
    else model.find().then(success, failure);
  });

  app.post('/message', function(req, res) {
    var body = req.body;
    var data = {
      user_id: messages.id(body.id),
      content: body.content,
    };

    model.create(data)
      .then(function(doc) {
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
    var id = messages.id(req.params.id);
    model.find_by_id(id, function(err, data) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: null,
          message: 'Unable to find message ' + id + '.'
        });
      } else {
        res.json({
          success: true,
          data: data,
          message: null
        });
      }
    });
  });

  app.put('/message/:id', function(req, res) {
    var id = messages.id(req.params.id);
    var body = req.body;

    model.update(id, body.edit, function(err) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: null,
          message: 'Unable to update message ' + id + '.'
        });
      } else {
        res.json({
          success: true,
          data: null,
          message: 'Successfully updated message ' + id + '.'
        });
      }
    });
  });

  app.delete('/message/:id', function(req, res) {
    var id = messages.id(req.params.id);

    model.remove(id, function(err) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: null,
          message: 'There was an error deleting message ' + id + '.'
        });
      } else {
        res.json({
          success: true,
          data: null,
          message: 'Successfully deleted message ' + id + '.'
        });
      }
    });
  });
}
