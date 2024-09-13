const mongoose = require('mongoose');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash the password using MD5 before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = md5(this.password); // Hash password with MD5
    }
    next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = function (password) {
    return this.password === md5(password); // Compare MD5 hashed passwords
};

const User = mongoose.model('User', userSchema);
module.exports = User;
