const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'dark' },
  },
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });


  // Method to compare hashed passwords
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };



const User = mongoose.model('User', userSchema);
module.exports = User;
