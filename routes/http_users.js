'use strict';

module.exports = function(app, handler) {
  app.post('/user', function(req, res) {
    var data = req.body;
    handler.create(data).then(function(reply) {
      res.json(reply);
    });
  });

  app.get('/user/:identity', function(req, res) {
    var identity = req.params.identity;
    handler.retrieve(identity).then(function(reply) {
      res.json(reply);
    });
  });

  app.put('/user/:identity', function(req, res) {
    var identity = req.params.identity;
    var data = req.body;
    handler.edit(id, data).then(function(reply) {
      res.json(reply);
    });
  });

  app.delete('/user/:identity', function(req, res) {
    var identity = req.params.identity;
    handler.delete(identity).then(function(reply) {
      res.json(reply);
    });
  });
};
