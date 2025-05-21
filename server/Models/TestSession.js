const { Schema, model } = require('mongoose');

const TestSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  material: { type: Schema.Types.ObjectId, ref: 'Material' }, 
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  score: { type: Number }, 
  isCompleted: { type: Boolean, default: false },
  totalScore: {type: Number, require: true},
  isCheked: {type: Boolean, default: false},
  questions: [
    {
      originalQuestionId: { type: Schema.Types.ObjectId }, // щоб знати, з якого шаблону брали
      question: { type: String, required: true },
      type: { type: String, enum: ['single', 'multiple', 'short', 'long'], required: true },
      options: [String],
      images: [
        {
          filename: { type: String },
          url: { type: String },
          type: { type: String },
        }
      ],
      points: {type: Number, require: true},
      userAnswer: Schema.Types.Mixed,
      scorePerQuestion: {type: Number, default: 0},
    }
  ]
});

module.exports = model('TestSession', TestSessionSchema);
