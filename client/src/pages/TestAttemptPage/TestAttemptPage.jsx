import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startTest, takeTest } from '../../api/testService';
import styles from './TestAttemptPage.module.css';

const TestAttemptPage = () => {
  const { assignmentID } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const endTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testData = await startTest(assignmentID);
        console.log(testData)
        let startTime = testData.test?.startedAt ? new Date(testData.test.startedAt) : new Date();
        const now = new Date();
        const allowedSeconds = (testData.testLimit || 0) * 60;
console.log(allowedSeconds)
        if (!testData.test?.startedAt) {
          startTime = now;
        }
console.log(startTime)
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
console.log(elapsedSeconds)
        if (allowedSeconds === 0) {
          setTest(testData.test);
          setTimeLeft(null);
        } else if (elapsedSeconds >= allowedSeconds) {
          setTimeLeft(0);
          setTest(testData.test);
        } else {
          setTest(testData.test);
          const timeRemaining = allowedSeconds - elapsedSeconds;
          setTimeLeft(timeRemaining);
          endTimeRef.current = Date.now() + timeRemaining * 1000;
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [assignmentID]);


  useEffect(() => {
    if (timeLeft === null || !test || test.testProperties?.timeLimit === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const secondsLeft = Math.max(Math.floor((endTimeRef.current - now) / 1000), 0);
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, test]);


  const handleAnswerChange = (questionIndex, value, type) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };

      if (type === 'single') {
        newAnswers[questionIndex] = [value];
      } else if (type === 'multiple') {
        newAnswers[questionIndex] = newAnswers[questionIndex] || [];
        if (newAnswers[questionIndex].includes(value)) {
          newAnswers[questionIndex] = newAnswers[questionIndex].filter(v => v !== value);
        } else {
          newAnswers[questionIndex] = [...newAnswers[questionIndex], value];
        }
      } else {
        newAnswers[questionIndex] = value;
      }

      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await takeTest(assignmentID, answers);
      if (response.success) navigate(`/assignment/${assignmentID}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (!test) return <div>Loading...</div>;

  return (
    <div className={styles.testContainer}>
      <div className={styles.testHeader}>
        <h1>{test.title}</h1>
        {timeLeft !== null && test.testProperties?.timeLimit !== 0 && (
          <div className={styles.timer}>
            Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className={styles.questionsContainer}>
        {test.questions.map((question, qIndex) => (
          <div key={qIndex} className={styles.questionCard}>
            <h3>Question {qIndex + 1}</h3>
            <p>{question.question}</p>

            {question.images && question.images.length > 0 && (
              <div className={styles.imageGrid}>
                {question.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img.url}
                    alt={`Question ${qIndex + 1} image ${imgIndex + 1}`}
                    className={styles.questionImage}
                  />
                ))}
              </div>
            )}

            {(question.type === 'single' || question.type === 'multiple') && (
              <div className={styles.options}>
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} className={styles.option}>
                    <input
                      type={question.type === 'single' ? 'radio' : 'checkbox'}
                      name={`question-${qIndex}`}
                      checked={
                        question.type === 'single'
                          ? answers[qIndex]?.[0] === oIndex
                          : answers[qIndex]?.includes(oIndex) || false
                      }
                      onChange={() => handleAnswerChange(qIndex, oIndex, question.type)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {(question.type === 'short' || question.type === 'long') && (
              <textarea
                className={styles.textAnswer}
                value={answers[qIndex] || ''}
                onChange={(e) => handleAnswerChange(qIndex, e.target.value, question.type)}
                rows={question.type === 'long' ? 6 : 2}
                placeholder={`Enter your answer here...`}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.submitSection}>
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default TestAttemptPage;
