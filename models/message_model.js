var Message = function(collection) {
  this.collection = collection;
}

Message.prototype.find = function(range) {
  // Default value for range query, actually interpreted as [0, 20)
  if (typeof range === 'undefined') range = [0, 20];
  var filter = {
    skip: range[0],
    limit: range[1],
    sort: {date_created: -1}
  };

  return this.collection.find({}, filter).then(format_data);
}

Message.prototype.find_by_id = function(id) {
  return this.collection.findOne({_id: id}).then(format_data);
}

Message.prototype.create = function(data) {
  var doc = {
    user_id: data.user_id,
    content: data.content,
    time_sent: new Date(),
    edited: false,
    deleted: false
  };

  return this.collection.insert(doc).then(format_data);
}

Message.prototype.update = function(id, edit) {
  var update = {content: edit, edited: true};
  return this.collection.updateById(id, update).then(format_data);
}

Message.prototype.remove = function(id, res) {
  var update = {deleted: true};
  return this.collection.updateById(id, update).then(format_data);
}

function format_data(data) {
  var format_doc = function(doc) {
    var content = doc.content;
    var time = doc.time_sent.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    if (doc.deleted) content = 'MESSAGE DELETED';
    else if (doc.edited) date += '*';
    return {
      user_id: doc.user_id,
      content: content,
      time_sent: time
    }
  }
  if (Array.isArray(data)) return data.map(format_doc);
  else return format_doc(data);
}

module.exports = function(collection) {
  return new Message(collection);
}
