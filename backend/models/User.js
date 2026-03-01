const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const watchlistItemSchema = new mongoose.Schema({
    coinId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
});

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
        },
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        nationality: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        profilePhoto: { type: String, default: '' },
        watchlist: { type: [watchlistItemSchema], default: [] },
    },
    { timestamps: true }
);

// Generate userId and hash password before saving
userSchema.pre('save', async function () {
    // Generate unique userId if not set
    if (!this.userId) {
        this.userId = `SL-${uuidv4().split('-')[0].toUpperCase()}`;
    }

    // Only hash password if it has been modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);