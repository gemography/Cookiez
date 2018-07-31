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

module.exports = mongoose.model('User', User);