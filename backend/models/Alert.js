const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    coinId: {
      type: String,
      required: true,
    },
    coinName: {
      type: String,
      required: true,
    },
    coinSymbol: {
      type: String,
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ['above', 'below'],
      required: true,
    },
    triggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);