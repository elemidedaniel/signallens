const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) portfolio = await Portfolio.create({ userId: req.user._id, holdings: [] });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

router.post('/holding', protect, async (req, res) => {
  try {
    const { coinId, coinName, coinSymbol, coinImage, amount, buyPrice } = req.body;
    let portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) portfolio = await Portfolio.create({ userId: req.user._id, holdings: [] });

    const existing = portfolio.holdings.find((h) => h.coinId === coinId);
    if (existing) {
      existing.amount = amount;
      existing.buyPrice = buyPrice;
    } else {
      portfolio.holdings.push({ coinId, coinName, coinSymbol, coinImage, amount, buyPrice });
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add holding' });
  }
});

router.delete('/holding/:coinId', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    portfolio.holdings = portfolio.holdings.filter((h) => h.coinId !== req.params.coinId);
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove holding' });
  }
});

module.exports = router;