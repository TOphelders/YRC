'use strict';

module.exports = function(app, handler) {
  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);

    var send = function(messages) {
      res.json(messages);
    };

    if (start && end) handler.retrieve_set([start, end]).then(send);
    else handler.retrieve_set().then(send);
  });

  app.post('/message', function(req, res) {
    var message = req.body;
    handler.send(message).then(function(reply) {
      res.json(reply);
    });
  });

  app.get('/message/:id', function(req, res) {
    var id = req.params.id;
    handler.retrieve(id).then(function(message) {
      res.json(message);
    });
  });

  app.put('/message/:id', function(req, res) {
    var id = req.params.id;
    var edit = req.body;
    handler.edit(id, edit).then(function(reply) {
      res.json(reply);
    });
  });

  app.delete('/message/:id', function(req, res) {
    var id = req.params.id;
    handler.delete(id).then(function(reply) {
      res.json(reply);
    });
  });
};
