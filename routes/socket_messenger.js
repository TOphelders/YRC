'use strict';

module.exports = function(socket, model) {
  socket.on('message-retrieve-set', function(range) {
    model.retrieve_set().then(function(messages) {
      socket.emit('message-reply', messages);
    });
  });

  socket.on('message-send', function(message) {
    model.send(message).then(function(reply) {
      socket.emit('message-reply', reply);
    });
  });

  socket.on('message-retrieve', function(id) {
    model.retrieve(id).then(function(message) {
      socket.emit('message-reply', message);
    });
  });

  socket.on('message-edit', function(data) {
    model.edit(data.id, data.edit).then(function(reply) {
      socket.emit('message-reply', reply);
    });
  });

  socket.on('message-delete', function(id) {
    model.delete(id).then(function(reply) {
      socket.emit('message-reply', reply);
    });
  });
};
