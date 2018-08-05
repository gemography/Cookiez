import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Transaction = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    default: 1,
  },
  reaction: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', Transaction);
