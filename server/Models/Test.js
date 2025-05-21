const { Schema, model } = require('mongoose');

const TestSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isRandomQuestions: { type: Boolean, required: true },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, enum: ['single', 'multiple', 'short', 'long'], required: true },
      options: [String],
      correctAnswers: [Schema.Types.Mixed],
      images: [{
        filename: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String }
      }],
      qPoints: { type: Number, default: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Test', TestSchema);
