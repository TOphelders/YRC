module.exports = function(app, io, db) {
  var messages = db.get('messages');
  var users = db.get('users');
  var model = require('../models/message_model.js')(messages);

  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);

    var op = function(err, data) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: null,
          message: 'Unable to load past messages.'
        });
      } else {
        res.json({
          success: true,
          data: data,
          message: null
        });
      }
    };

    if (start && end) model.find(op, [start, end]);
    else model.find(op);
  });

  app.post('/message', function(req, res) {
    var body = req.body;
    var data = {
      user_id: messages.id(body.id),
      content: body.content,
      time_sent: new Date(),
      edited: false,
      deleted: false
    };

    model.create(data, function(err) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: null,
          message: 'Oops! Something went wrong when sending your message, wait for a second and try again.'
        });
      } else {
        io.emit('message posted', data);
        res.json({
          success: true,
          data: null,
          message: 'Message successfully sent.'
        });
      }
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
