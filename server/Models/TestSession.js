const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} ImageAttachment
 * @property {string} [filename] - The name of the image file.
 * @property {string} [url] - The URL where the image is stored.
 * @property {string} [type] - The type of the image (e.g., mime-type).
 */

/**
 * @typedef {Object} TestQuestion
 * @property {import('mongoose').Types.ObjectId} [originalQuestionId] - The original question's ID from the Test model.
 * @property {string} question - The text of the question.
 * @property {'single'|'multiple'|'short'|'long'} type - The type of question.
 * @property {string[]} [options] - Possible answer options (for single/multiple choice).
 * @property {ImageAttachment[]} [images] - Images associated with the question.
 * @property {number} points - Points assigned to the question.
 * @property {*} [userAnswer] - The user's submitted answer, type depends on question type.
 * @property {number} [scorePerQuestion=0] - Score received for this question.
 */

/**
 * @typedef {Object} TestSession
 * @property {import('mongoose').Types.ObjectId} user - Reference to the User who took the test.
 * @property {import('mongoose').Types.ObjectId} test - Reference to the Test.
 * @property {import('mongoose').Types.ObjectId} [material] - Reference to the related Material.
 * @property {Date} startedAt - Timestamp when the test session started.
 * @property {Date} [completedAt] - Timestamp when the test session was completed.
 * @property {number} [score] - Total score the user achieved.
 * @property {boolean} [isCompleted=false] - Flag indicating if the test session is completed.
 * @property {number} totalScore - Total possible score for the test.
 * @property {boolean} [isCheked=false] - Flag indicating if the test session has been checked/graded.
 * @property {TestQuestion[]} questions - Array of questions with user's answers and scoring.
 */

/**
 * TestSession Schema
 * 
 * Represents an individual user's attempt to complete a test.
 * 
 * Features:
 * - Links to User, Test, and optionally Material.
 * - Tracks start and completion times.
 * - Stores user's answers per question with individual scoring.
 * - Tracks total score possible and user's score.
 * - Flags for completion and grading status.
 */
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
      originalQuestionId: { type: Schema.Types.ObjectId }, 
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

/**
 * Mongoose model for the `TestSession` collection.
 */
module.exports = model('TestSession', TestSessionSchema);
