import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TestCreationForm.module.css';
import { deleteFile, uploadFiles } from '../../api/fileService';
import { createTest, getTestById, updateTest } from '../../api/testService';

const TestCreationForm = () => {
  const navigate = useNavigate();
  const { test_id } = useParams()
  const [test, setTest] = useState({
    title: '',
    description: '',
    isRandomQuestions: false,
    questions: [
      {
        type: 'single',
        question: '',
        options: ['', ''],
        correctAnswers: [0],
        images: []
      }
    ],
    qPoints: 1,
  });

  const imageForRemoving = [];

  useEffect(() => {
    const fetchTest = async () => {
      if (test_id) {
        console.log(test_id)
        const data = await getTestById(test_id)
        console.log(data)
        setTest(data)
      }
    }

    fetchTest();
  }, [test_id]);


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

  const addOption = (qIndex) => {
    const newQuestions = [...test.questions];
    if (newQuestions[qIndex].options.length < 6) {
      newQuestions[qIndex].options.push('');
      setTest({ ...test, questions: newQuestions });
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...test.questions];
    if (newQuestions[qIndex].options.length > 2) {
      newQuestions[qIndex].options.splice(oIndex, 1);

      newQuestions[qIndex].correctAnswers = newQuestions[qIndex].correctAnswers
        .filter(i => i !== oIndex)
        .map(i => i > oIndex ? i - 1 : i);
      setTest({ ...test, questions: newQuestions });
    }
  };

  const handleFileChange = (qIndex, e) => {
    const files = Array.from(e.target.files);
    const newQuestions = [...test.questions];
    const currentImages = newQuestions[qIndex].images || [];

    if (currentImages.length + files.length > newQuestions[qIndex].options.length) {
      alert(`Maximum ${newQuestions[qIndex].options.length} images allowed per question`);
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    newQuestions[qIndex].images = [...currentImages, ...newImages];
    setTest({ ...test, questions: newQuestions });
  };

  const removeImage = (qIndex, imgIndex) => {
    const newQuestions = [...test.questions];
    if (newQuestions[qIndex].images[imgIndex].file) {
      URL.revokeObjectURL(newQuestions[qIndex].images[imgIndex].preview);
    }
    else {
      imageForRemoving.push(newQuestions[qIndex].images[imgIndex].url)
    }
    newQuestions[qIndex].images.splice(imgIndex, 1);
    setTest({ ...test, questions: newQuestions });
  };

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        { type: 'single', question: '', options: ['', ''], correctAnswers: [0], images: [] }
      ]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = test.questions.filter((_, i) => i !== index);
    setTest({ ...test, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageForRemoving.length > 0) {
      imageForRemoving.forEach(async (i) => await deleteFile(i))
    }

    let questions = await Promise.all(test.questions.map(async (q) => {
      let question = q;
      if (q.images.length > 0) {
        try {
          const uploadedImages = await Promise.all(
            q.images.map(async (i) => (i.file ? (await uploadFiles(i.file, 'tests'))[0] : i))
          );
          question.images = uploadedImages
        } catch (err) {
          console.error('Помилка при завантаженні файлів:', err.response?.data || err.message);
          return question;
        }
      }
      // if (q.type === "short") {
      //    question.correctAnswers = q.correctAnswers[0].split(',').map(item => item.trim());
      // }

      return question;
    }));

    const newTest = test;
    newTest.questions = questions;
    console.log(newTest)

    test_id ? await updateTest(newTest, test_id) : await createTest(newTest);
    navigate('/tests')
  };


  return (
    <div className={styles.testCreationForm}>
      <div className={styles.formHeader}>
        <h1>Create New Test</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Test Title</label>
          <input
            type="text"
            value={test.title}
            onChange={(e) => setTest({ ...test, title: e.target.value })}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={test.description}
            onChange={(e) => setTest({ ...test, description: e.target.value })}
            required
          />
        </div>

        <div className={styles.questionsSection}>
          <h2>Questions</h2>
          {test.questions.map((q, qIndex) => (
            <div key={qIndex} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h3>Question {qIndex + 1}</h3>
                {test.questions.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeQuestion}
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Question Type</label>
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="short">Short Answer</option>
                  <option value="long">Long Answer</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Question Text</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Question points</label>
                <input
                  type="number"
                  value={q.qPoints}
                  onChange={(e) => handleQuestionChange(qIndex, 'qPoints', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{`Upload Images (max ${q.options.length})`}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(qIndex, e)}
                  multiple
                  disabled={q.images && q.images.length >= q.options.length}
                />
                {q.images && q.images.length > 0 && (
                  <div className={styles.imagePreviewContainer}>
                    {q.images.map((img, imgIndex) => (
                      <div key={imgIndex} className={styles.imagePreview}>
                        <div
                          className={styles.backgroundBlur}
                          style={{ backgroundImage: `url(${img.preview || img.url})` }}
                        />
                        <img src={img.preview || img.url} alt={`Preview ${imgIndex + 1}`} className={styles.foregroundImage} />
                        <button
                          type="button"
                          className={styles.removeImage}
                          onClick={() => removeImage(qIndex, imgIndex)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(q.type === 'single' || q.type === 'multiple') && (
                <div className={styles.optionsGroup}>
                  <div className={styles.optionsHeader}>
                    <label>Options</label>
                    {q.options.length < 6 && (
                      <button
                        type="button"
                        className={styles.addOptionButton}
                        onClick={() => addOption(qIndex)}
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className={styles.optionInput}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      <input
                        type={q.type === 'single' ? 'radio' : 'checkbox'}
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswers.includes(oIndex)}
                        onChange={() => {
                          const newCorrect = q.type === 'single'
                            ? [oIndex]
                            : q.correctAnswers.includes(oIndex)
                              ? q.correctAnswers.filter(i => i !== oIndex)
                              : [...q.correctAnswers, oIndex];
                          handleQuestionChange(qIndex, 'correctAnswers', newCorrect);
                        }}
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          className={styles.removeOptionButton}
                          onClick={() => removeOption(qIndex, oIndex)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'short' && (
                <div className={styles.formGroup}>
                  <label>Correct Answer</label>
                  <input
                    type="text"
                    placeholder="Enter the correct answer"
                    value={q.correctAnswers[0] || ''}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswers', [e.target.value])}
                  />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addQuestion}
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>Create Test</button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/tests')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestCreationForm;