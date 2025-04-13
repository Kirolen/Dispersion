import React, { useState } from 'react';
import './TestCreationForm.module.css';

const TestCreationForm = ({ onSubmit, onCancel }) => {
  const [test, setTest] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questions: [
      {
        type: 'single',
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [0],
        image: null
      }
    ]
  });

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...test.questions];
    newQuestions[index][field] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...test.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleFileChange = (qIndex, e) => {
    const file = e.target.files[0];
    const newQuestions = [...test.questions];
    newQuestions[qIndex].image = file;
    setTest({ ...test, questions: newQuestions });
  };

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        { type: 'single', question: '', options: ['', '', '', ''], correctAnswers: [0], image: null }
      ]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = test.questions.filter((_, i) => i !== index);
    setTest({ ...test, questions: newQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(test);
  };

  return (
    <div className="test-creation-form">
      <h2>Create New Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-test-group">
          <label>Test Title</label>
          <input type="text" value={test.title} onChange={(e) => setTest({ ...test, title: e.target.value })} required />
        </div>

        <div className="form-test-group">
          <label>Description</label>
          <textarea value={test.description} onChange={(e) => setTest({ ...test, description: e.target.value })} required />
        </div>

        <div className="form-test-group">
          <label>Time Limit (minutes)</label>
          <input type="number" value={test.timeLimit} onChange={(e) => setTest({ ...test, timeLimit: parseInt(e.target.value) })} min="1" required />
        </div>

        <div className="questions-section">
          <h3>Questions</h3>
          {test.questions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <h4>Question {qIndex + 1}</h4>
              {test.questions.length > 1 && <button type="button" className="remove-question" onClick={() => removeQuestion(qIndex)}>Remove</button>}

              <div className='form-test-group'>
                <label>Type:</label>
                    <select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}>
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="short">Short Answer</option>
                        <option value="long">Long Answer</option>
                    </select>
              </div>


              <div className="form-test-group">
                <label>Question Text</label>
                <input
                  className='question-area'
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  required
                />
              </div>

              <div className="form-test-group">
              <label>Upload Image (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(qIndex, e)} />
              </div>

              

              {q.type === 'single' || q.type === 'multiple' ? (
                <div className="options-group">
                  <h5>Options</h5>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-input">
                      <input type="text" value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required />
                      <input
                        type={q.type === 'single' ? 'radio' : 'checkbox'}
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswers.includes(oIndex)}
                        onChange={() => {
                          const newCorrect = q.type === 'single' ? [oIndex] : q.correctAnswers.includes(oIndex) ? q.correctAnswers.filter((i) => i !== oIndex) : [...q.correctAnswers, oIndex];
                          handleQuestionChange(qIndex, 'correctAnswers', newCorrect);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : q.type === 'short' ? (
                <div>
                  <label>Correct Answers</label>
                  <input type="text" placeholder="Enter correct answers separated by commas" onChange={(e) => handleQuestionChange(qIndex, 'correctAnswers', e.target.value.split(','))} />
                </div>
              ) : null}
            </div>
          ))}
          <button type="button" className="add-question" onClick={addQuestion}>Add Question</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Create Test</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TestCreationForm;
