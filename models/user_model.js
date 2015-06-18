var User = function(collection) {
  this.collection = collection;
}

User.prototype.find = function(identifier, res) {
  this.collection.findOne({$or: [{_id: identifier}, {username: identifier}]}
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res(null, doc);
    });
}

User.prototype.create = function(data, res) {
  this.collection.insert(data)
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res();
    });
}

User.prototype.update = function(identifier, update, res) {
  this.collection.update({$or: [{_id: identifier}, {username: identifier}]}, update)
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function(doc) {
      res();
    });
}

User.prototype.remove = function(identifier, res) {
  this.collection.remove({$or: [{_id: identifier}, {username: identifier}]})
    .error(function(err) {
      res(err.name + ': ' + err.message);
    })
    .success(function() {
      res();
    });
}

module.exports = function(collection) {
  return new User(collection);
}
