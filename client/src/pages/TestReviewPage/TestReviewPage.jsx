import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TestReviewPage.module.css';
import { getTestAttempt, updateScore } from '../../api/testService';

const TestReviewPage = () => {
    const { assignmentID, studentId } = useParams();
    const [testAttempt, setTestAttempt] = useState(null);
    const [originalScores, setOriginalScores] = useState([]);

    useEffect(() => {
        const fetchTestAttempt = async () => {
            try {
                const data = await getTestAttempt(assignmentID, studentId);
                setTestAttempt(data.testInfo);
                setOriginalScores(data.testInfo.questions.map(q => q.userScorePerQuestion));
            } catch (error) {
                console.error('Error fetching test attempt:', error);
            }
        };
        fetchTestAttempt();
    }, [assignmentID, studentId]);

    if (!testAttempt) return <div>Loading...</div>;

    const handleScoreChange = (index, newScore) => {
        const updatedQuestions = [...testAttempt.questions];
        updatedQuestions[index].scorePerQuestion = parseFloat(newScore);
        setTestAttempt({
            ...testAttempt,
            questions: updatedQuestions,
        });
    };

    const handleSubmit = async () => {
        const changedScores = testAttempt.questions
            .map((q, i) => ({
                index: i,
                newScore: q.scorePerQuestion,
                oldScore: originalScores[i]
            }))
            .filter(q => q.newScore !== q.oldScore);


        const response = await updateScore(assignmentID, studentId, changedScores)
        if (response.success) {
            window.location.reload();
        }
    };

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.reviewHeader}>
                <h1>Test Review</h1>
                <div className={styles.studentInfo}>
                    <h2>Student: {testAttempt.studentName}</h2>
                    <p>
                        Score: {testAttempt.score} / {testAttempt.totalPoints}
                    </p>
                </div>
            </div>

            <div className={styles.questionsContainer}>
                {testAttempt.questions?.map((question, index) => (
                    <div key={index} className={styles.questionCard}>
                        <h3>Question {index + 1}</h3>
                        <p>{question.text}</p>
                        <p>{`Max points: ${question.points}`}</p>
                        <p>{`Getted points: ${question.userScorePerQuestion}`}</p>

                        {question.images?.length > 0 && (
                            <div className={styles.imageGrid}>
                                {question.images.map((img, imgIndex) => (
                                    <div
                                        key={imgIndex}
                                        className={styles.imageWrapper}
                                        style={{ backgroundImage: `url(${img.url})` }}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Question image ${imgIndex + 1}`}
                                            className={styles.questionImage}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.answerSection}>
                            <div className={styles.studentAnswer}>
                                <h4>Student's Answer:</h4>
                                {(question.type === 'short' || question.type === 'long') ? (
                                    <p>{question.studentAnswer}</p>
                                ) : (
                                    <ul>
                                        {question.options.map((option, oIndex) => (
                                            <li key={oIndex} className={
                                                `${styles.option} 
                                                ${question.studentAnswer?.includes(oIndex) ? styles.selected : ''} 
                                                ${question.correctAnswer?.includes(oIndex) ? styles.correct : ''}`
                                            }>
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={styles.correctAnswer}>
                                <h4>Correct Answer:</h4>
                                {(question.type === 'short' || question.type === 'long') ? (
                                    <p>{Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}</p>
                                ) : (
                                    <ul>
                                        {question.correctAnswer?.map((answerIndex) => (
                                            <li key={answerIndex}>{question.options[answerIndex]}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className={styles.scoreInput}>
                            <label>Score:</label>
                            <input
                                type="number"
                                step="0.01"
                                value={question.scorePerQuestion ?? ''}
                                min={0}
                                max={question.points}
                                onChange={(e) => handleScoreChange(index, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.submitContainer}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit Changes
                </button>
            </div>
        </div>
    );
};

export default TestReviewPage;
