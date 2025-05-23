const { Schema, model } = require('mongoose');

/**
 * @typedef {Object} ImageAttachment
 * @property {string} filename - The name of the image file.
 * @property {string} url - The URL where the image is accessible.
 * @property {string} [type] - The type of the image (e.g., mime-type).
 */

/**
 * @typedef {Object} Question
 * @property {string} question - The question text.
 * @property {'single'|'multiple'|'short'|'long'} type - The question type.
 * @property {string[]} [options] - Possible answer options (for 'single' and 'multiple' types).
 * @property {Array} correctAnswers - The correct answers; type depends on question type.
 * @property {ImageAttachment[]} [images] - Images associated with the question.
 * @property {number} [qPoints=1] - Points awarded for the question.
 */

/**
 * @typedef {Object} Test
 * @property {string} title - Title of the test.
 * @property {string} [description] - Optional description of the test.
 * @property {import('mongoose').Types.ObjectId} createdBy - User ID of the test creator.
 * @property {boolean} isRandomQuestions - Whether questions should be randomized.
 * @property {Question[]} questions - Array of questions in the test.
 * @property {Date} createdAt - Date the test was created.
 */

/**
 * Test Schema
 * 
 * Defines the structure of a Test document.
 * 
 * Features:
 * - Supports multiple question types: single choice, multiple choice, short answer, and long answer.
 * - Questions can include multiple images and answer options.
 * - Points can be assigned per question.
 * - Tracks the user who created the test.
 * - Option to randomize question order.
 */
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

/**
 * Mongoose model for the `Test` collection.
 */
module.exports = model('Test', TestSchema);
