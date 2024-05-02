const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

// Create a user data model
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Plugin-> ensure that two users cannot share the same email address
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);