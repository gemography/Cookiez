import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  userId: String,
  total: {
    type: Number,
    default: 0,
  },
  remaining: {
    type: Number,
    default: 7,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

User.statics.resetRemaining = function() {
  return this.update({}, { $set: { remaining: 7 } });
};

module.exports = mongoose.model('User', User);