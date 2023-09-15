const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
  
});

module.exports = model('User', userSchema);
