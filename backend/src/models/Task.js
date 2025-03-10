const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String },
  priority: { type: String },
  status: { type: String, default: 'Incomplete' },
  due_date: { type: Date },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;


// In the end i think i need to finish the book because its hi