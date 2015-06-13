var Message = function(collection) {
  this.collection = collection;
}

Message.prototype.find = function(res, range) {
  // Default value for range query, actually interpreted as [0, 20)
  if (typeof range === 'undefined') range = [0, 20];

  this.collection.find({}, {skip: range[0], limit: range[1], sort: {date_created: -1}})
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(docs) {
      res(null, docs);
    });
}

/*Message.prototype.find_by_user = function(name, callback, range) {
  if (typeof range === 'undefined') range = [0, 20];

  messages.find({user_id: id}, {sort: {date_created: -1}}, function(err, docs) {
    if(err) throw err;
    res(docs);
  });
}*/

Message.prototype.find_by_id = function(id, res) {
  this.collection.findOne({_id: id})
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res(null, doc);
    });
}

Message.prototype.create = function(data, res) {
  this.collection.insert(data)
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res();
    });
}

Message.prototype.update = function(id, edit, res) {
  var update = {content: edit, edited: true};
  this.collection.updateById(id, update)
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res();
    });
}

Message.prototype.remove = function(id, res) {
  var update = {deleted: true};
  this.collection.updateById(id, update)
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res();
    });
}

module.exports = function(collection) {
  return new Message(collection);
}
