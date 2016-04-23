var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: { type: String, required: true, lowercase: true, unique: true },
    isGlobalAdmin: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('User', userSchema);