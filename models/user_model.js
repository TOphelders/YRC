var User = function(collection) {
  this.collection = collection;
}

User.prototype.find = function(identifier) {
  var refs = [{_id: this.collection.id(identifier)}, {username: identifier}];
  return this.collection.findOne({$or: refs}).then(format_user);
}

User.prototype.create = function(data) {
  var doc = {
    username: data.username,
    password: data.password,
    email: data.email,
    date_created: new Date()
  };

  return this.collection.insert(doc).then(format_user);
}

User.prototype.update = function(identifier, update) {
  var refs = [{_id: this.collection.id(identifier)}, {username: identifier}];
  return this.collection.update({$or: refs}, update).then(format_user);
}

User.prototype.remove = function(identifier, res) {
  var refs = [{_id: this.collection.id(identifier)}, {username: identifier}];
  return this.collection.remove({$or: refs}).then(format_user);
}

function format_user(doc) {
  var time = doc.date_created.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    date_created: time
  }
}

module.exports = function(collection) {
  return new User(collection);
}
