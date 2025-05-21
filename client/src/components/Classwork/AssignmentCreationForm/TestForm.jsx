import { useEffect, useState } from "react";
import styles from "./AssignmentCreationForm.module.css";

const TestForm = ({ assignmentForm, testProperties, setTestProperties, testsArray, handleTestChange }) => {
  const [curTest, setCurTest] = useState(null);

    useEffect(() => {
        if (assignmentForm.test && testsArray.length > 0) {
            const foundTest = testsArray.find(t => t.id === assignmentForm.test);
            console.log(foundTest)
            setCurTest(foundTest || null);
        } else {
            setCurTest(null);
        }
    }, [assignmentForm.test]);

    const updateTestProperties = (key, value) => {
        console.log(value)
        setTestProperties(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (<>
        <select onChange={handleTestChange}  value={assignmentForm.test || ''}>
            <option value="">Select test</option>
            {testsArray.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.title}
                </option>
            ))}
        </select>

        <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={testProperties.isRandomQuestions}
                    onChange={(e) => setTestProperties({
                        ...testProperties,
                        isRandomQuestions: e.target.checked
                    })}
                />
                Enable Random Questions Selection
            </label>
        </div>

        <div className={styles.testStartDate}>
            <label className={styles.dueDateLabel}>Start Date</label>
            <input
                type="datetime-local"
                name="dueDate"
                value={testProperties.startDate?.substring(0, 16) || ''}
                onChange={(e) => updateTestProperties("startDate", e.target.value)}
            />
        </div>

        <div className={styles.endStartDate}>
            <label className={styles.dueDateLabel}>End Date</label>
            <input
                type="datetime-local"
                name="dueDate"
                value={testProperties.endDate?.substring(0, 16) || ''}
                onChange={(e) => updateTestProperties("endDate", e.target.value)}
            />
        </div>
        <div className={styles.endStartDate}>
            <label className={styles.dueDateLabel}>Test limit</label>
            <input
                type="number"
                name="timeLimit"
                value={testProperties.timeLimit || 0}
                onChange={(e) => updateTestProperties("timeLimit", e.target.value)}
                placeholder="Leave blank for no time limit"
            />
        </div>

        {testProperties.isRandomQuestions && assignmentForm.test && (
            <div className={styles.randomQuestionsSection}>
                <h4>Number of Questions by Type</h4>
                <div className={styles.questionTypeGrid}>
                    {Object.entries(testProperties.questionCountByType).map(([type, count]) => (
                        <div key={type} className={styles.questionTypeInput}>
                            <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                            <input
                                type="number"
                                min="0"
                                max={curTest?.questionTypeCount[type]}
                                value={count === 0 ? '' : count}
                                placeholder={`max ${curTest?.questionTypeCount[type]} questions`}
                                onChange={(e) => {
                                    let newValue = parseInt(e.target.value || '0', 10);
                                    if (newValue > curTest?.questionTypeCount[type]) {
                                        newValue = curTest?.questionTypeCount[type];
                                    }
                                    setTestProperties(prev => ({
                                        ...prev,
                                        questionCountByType: {
                                            ...prev.questionCountByType,
                                            [type]: newValue
                                        }
                                    }));
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
    );
};

export default TestForm;