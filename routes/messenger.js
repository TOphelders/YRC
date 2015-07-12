function Messenger(io, cols) {
  this.sockets = io;
  this.msg_model = require('../models/message_model.js')(cols.messages);
  this.usr_model = require('../models/user_model.js')(cols.users);
}

Messenger.prototype.retrieve_set = function(range) {
  // Return first 20 messages by default
  if (typeof range === 'undefined') range = [0, 19];
  var self = this;
  var reply_data = [];

  // After documents were found, get the correct username for each one
  var found = function(data) {
    reply_data = data;
    return data.reduce(function(prev, doc, inc) {
      return prev.then(function(user) {
        reply_data[inc].username = user.username;
        return self.usr_model.find(doc.user_id);
      });
    }, self.usr_model.find(data[0].user_id));
  };

  return this.msg_model.find(range)
    .then(found)
    .then(function() {
      return succeed(reply_data);
    },
    fail('Unable to retrieve messages ' + range[0] + ' to ' + range[1]));
}

Messenger.prototype.send = function(data) {
  var self = this;
  var username = data.username;
  var msg_data = {
    user_id: data.id,
    content: data.content
  };

  var emit = function(message) {
    message.username = username;
    self.sockets.emit('message-posted', message);
  };

  var create_promise = this.msg_model.create(msg_data)
  create_promise.then(emit);
  create_promise.then(function() {
    return succeed('Message successfully sent');
  },
  fail('Oops! Something went wrong when sending your message, wait for a second and try again.'));
};

Messenger.prototype.retrieve = function(id) {
  var reply_data = {};
  var self = this;

  return this.msg_model.find_by_id(id)
    .then(function(data) {
      reply_data = data;
      return self.usr_model.find(data.user_id);
    })
    .then(function(user) { reply_data.username = user.username; })
    .then(function() {
      return succeed(reply_data);
    },
    fail('Unable to find message: ' + id));
};

Messenger.prototype.edit = function(id, edit) {
  var self = this;
  var emit = function(message) {
    self.sockets.emit('message-edited', message);
  };

  var update_promise = this.msg_model.update(id, edit);
  update_promise.then(emit);
  return update_promise.then(function() {
    return succeed('Successfully updated message: ' + id);
  },
  fail('There was an error trying to update message: ' + id));
};

Messenger.prototype.delete = function(id) {
  var self = this;
  var emit = function(message) {
    self.sockets.emit('message-deleted', message);
  };

  var remove_promise = this.msg_model.remove(id);
  remove_promise.then(emit);
  return remove_promise.then(function() {
    return succeed('Successfully deleted message: ' + id);
  },
  fail('Something went wrong trying to delete message: ' + id));
};

function succeed(data, message) {
  if (typeof data === 'string') {
    message = data;
    data = null;
  } else if (typeof data === 'undefined') {
    data = null;
    message = null;
  } else if (typeof message === 'undefined') message = null;
  console.log(data);

  return {
    success: true,
    data: data,
    message: message
  };
}

function fail(message) {
  return function(err) {
    console.log(err.code + ': ' + err.message);
    return {
      success: false,
      data: null,
      message: message
    };
  };
}

module.exports = function(io, cols) {
  return new Messenger(io, cols)
};
