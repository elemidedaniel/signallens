const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  coinName: { type: String, required: true },
  coinSymbol: { type: String, required: true },
  coinImage: { type: String },
  amount: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    holdings: [holdingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);