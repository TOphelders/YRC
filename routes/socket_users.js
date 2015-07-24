'use strict';

module.exports = function(socket, model) {
  socket.on('user-create', function(user_data) {
    model.create(user_data).then(function(reply) {
      socket.emit('user-reply', reply);
    });
  });

  socket.on('user-retrieve', function(identity) {
    model.retrieve(identity).then(function(user) {
      socket.emit('user-reply', user);
    });
  });

  socket.on('user-edit', function(data) {
    model.edit(data.identity, data.edit).then(function(reply) {
      socket.emit('user-reply', reply);
    });
  });

  socket.on('user-delete', function(identity) {
    model.delete(identity).then(function(reply) {
      socket.emit('user-reply', reply);
    });
  });
};
