const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/alerts
// Create a new alert
router.post('/', protect, async (req, res) => {
    try {
        const { coinId, coinName, coinSymbol, targetPrice, condition } = req.body;

        if (!coinId || !coinName || !coinSymbol || !targetPrice || !condition) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const alert = await Alert.create({
            userId: req.user.userId,
            email: req.user.email,
            coinId,
            coinName,
            coinSymbol,
            targetPrice,
            condition,
        });

        res.status(201).json(alert);
    } catch (error) {
        console.error('Create alert error:', error.message);
        res.status(500).json({ message: 'Failed to create alert' });
    }
});

// @route GET /api/alerts
// Get all alerts for the logged in user
router.get('/', protect, async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.user.userId }).sort({
            createdAt: -1,
        });
        res.json(alerts);
    } catch (error) {
        console.error('Get alerts error:', error.message);
        res.status(500).json({ message: 'Failed to fetch alerts' });
    }
});

// @route DELETE /api/alerts/:id
// Delete an alert
router.delete('/:id', protect, async (req, res) => {
    try {
        const alert = await Alert.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json({ message: 'Alert deleted' });
    } catch (error) {
        console.error('Delete alert error:', error.message);
        res.status(500).json({ message: 'Failed to delete alert' });
    }
});

// @route PUT /api/alerts/:id/toggle
// Toggle alert active status
router.put('/:id/toggle', protect, async (req, res) => {
    try {
        const alert = await Alert.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        alert.active = !alert.active;
        await alert.save();
        res.json(alert);
    } catch (error) {
        console.error('Toggle alert error:', error.message);
        res.status(500).json({ message: 'Failed to toggle alert' });
    }
});

module.exports = router;