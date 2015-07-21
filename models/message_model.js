'use strict';

function Message(collection) {
  this.collection = collection;
}

Message.prototype.find = function(range) {
  var filter = {
    skip: range[0],
    limit: range[1] - range[0] + 1,
    sort: {time_sent: 1}
  };

  return this.collection.find({}, filter).then(format_data);
};

Message.prototype.find_by_id = function(id) {
  return this.collection.findOne({_id: this.collection.id(id)}).then(format_data);
};

Message.prototype.create = function(data) {
  var doc = {
    user_id: this.collection.id(data.user_id),
    content: data.content,
    time_sent: new Date(),
    edited: false,
    deleted: false
  };

  return this.collection.insert(doc).then(format_data);
};

Message.prototype.update = function(id, edit) {
  var update = {content: edit, edited: true};
  return this.collection.updateById(this.collection.id(id), update).then(format_data);
};

Message.prototype.remove = function(id, res) {
  var update = {deleted: true};
  return this.collection.updateById(this.collection.id(id), update).then(format_data);
};

function format_data(data) {
  if (data === null) {
    var err = new Error('Queried object does not exist');
    err.code = 5000;
    throw err;
  }

  var format_doc = function(doc) {
    var content = doc.content;
    var time = doc.time_sent.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    if (doc.deleted) content = 'MESSAGE DELETED';
    else if (doc.edited) date += '*';
    return {
      message_id: doc._id.toString(),
      user_id: doc.user_id.toString(),
      content: content,
      time_sent: time
    }
  }
  if (Array.isArray(data)) return data.map(format_doc);
  else return format_doc(data);
};

var cache = {};
module.exports = function(collection) {
  if (!(collection.name in cache)) cache[collection.name] = new Message(collection);
  return cache[collection.name];
};
