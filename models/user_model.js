var User = function(collection) {
  this.collection = collection;
}

User.prototype.find = function(identifier) {
  var refs = {};
  refs[(is_id(identifier) ? '_id' : 'username')] = identifier;
  return this.collection.findOne(refs).then(format_user);
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
  var refs = {};
  refs[(is_id(identifier) ? '_id' : 'username')] = identifier;
  return this.collection.update(refs, update).then(format_user);
}

User.prototype.remove = function(identifier) {
  var refs = {};
  refs[(is_id(identifier) ? '_id' : 'username')] = identifier;
  return this.collection.remove(refs).then(format_user);
}

function format_user(doc) {
  if (doc === null) {
    var err = new Error('Queried object does not exist');
    err.code = 5000;
    throw err;
  }

  var time = doc.date_created.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    date_created: time
  }
}

function is_id(string) {
  return (string.match(/^[0-9a-fA-F]{24}$/));
}

module.exports = function(collection) {
  return new User(collection);
}
