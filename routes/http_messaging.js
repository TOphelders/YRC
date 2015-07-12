module.exports = function(app, model) {
  app.get('/message(/start/:start/end/:end)?', function(req, res) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);

    var send = function(messages) {
      res.json(messages);
    };

    if (start && end) model.retrieve_set([start, end]).then(send);
    else model.retrieve_set().then(send);
  });

  app.post('/message', function(req, res) {
    var message = req.body;
    model.send(message).then(function(reply) {
      res.json(reply);
    });
  });

  app.get('/message/:id', function(req, res) {
    var id = req.params.id;
    model.retrieve(id).then(function(message) {
      res.json(message);
    });
  });

  app.put('/message/:id', function(req, res) {
    var id = req.params.id;
    var edit = req.body;
    model.edit(id, edit).then(function(reply) {
      res.json(reply);
    });
  });

  app.delete('/message/:id', function(req, res) {
    var id = req.params.id;
    model.delete(id).then(function(reply) {
      res.json(reply);
    });
  });
};
