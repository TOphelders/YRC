'use strict';

function UserHandler(io, cols) {
  this.sockets = io;
  this.usr_model = require(global.app_root + '/models/user_model.js')(cols.users);
}

UserHandler.prototype.create = function(body) {
  var data = {
    username: body.username,
    password: body.password,
    email: body.email,
  };

  return this.usr_model.create(data)
    .then(function() {
      return succeed('user-create', 'User successfully created');
    },
    fail('user-create','The user could not be created.'));
};

UserHandler.prototype.retrieve = function(identity) {
  return this.usr_model.find(identity)
    .then(function(user) {
      return succeed('user-retrieve', user);
    },
    fail('user-retrieve', 'User: ' + identity +
         ' could not be found or does not exist, try checking your spelling.'));
};

UserHandler.prototype.edit = function(identity, data) {
  var edit = {};
  var emit = function(user) {
    this.sockets.emit('user-edited', user);
  }.bind(this);

  Object.keys(data).forEach(function(element, key) {
    if (['username', 'password', 'email'].includes(key)) edit[key] = element;
  });

  var update_promise = this.usr_model.update(identity, edit);
  update_promise.then(emit);
  return update_promise.then(function() {
    return succeed('user-edit', 'User: ' + identity + ' successfully updated');
  },
  fail('user-edit', 'User: ' + identity +
       ' could not be updated or does not exist, try checking your spelling.'));
};

UserHandler.prototype.delete = function(identity) {
  var emit = function(user) {
    this.sockets.emit('user-deleted', user);
  }.bind(this);

  var remove_promise = this.usr_model.remove(identity);
  remove_promise.then(emit);
  return remove_promise.then(function() {
    return succeed('user-delete', 'User: ' + identity + ' successfully deleted')
  },
  fail('user-delete', 'User: ' + identity + ' could not be deleted or does not exist'));
};

function succeed(action, data, message) {
  if (typeof data === 'string') {
    message = data;
    data = null;
  } else if (typeof data === 'undefined') {
    data = null;
    message = null;
  } else if (typeof message === 'undefined') message = null;

  return {
    success: true,
    action: action,
    data: data,
    message: message
  };
}

function fail(action, message) {
  if (typeof message === 'undefined') message = null;
  return function(err) {
    console.log(err.code + ': ' + err.message);
    return {
      success:false,
      action: action,
      data: null,
      message: message
    };
  };
}

module.exports = function(io, cols) {
  return new UserHandler(io, cols);
}
