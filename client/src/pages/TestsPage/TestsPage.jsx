import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestsPage.module.css';
import { getTests } from '../../api/testService';

const TestsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests()
        console.log(data)
        setTests(data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className={styles.testsContainer}>
      <div className={styles.testsHeader}>
        <h1>Tests</h1>
        <button 
          className={styles.createButton}
          onClick={() => navigate('/tests/create')}
        >
          Create Test
        </button>
      </div>
      
      <div className={styles.testsList}>
        {loading ? (
          <p>Loading tests...</p>
        ) : tests.length === 0 ? (
          <p>No tests available</p>
        ) : (
          tests.map((test) => (
            <div key={test.id} className={styles.testCard}>
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              <p><strong>Questions:</strong> {test.questionCount}</p>
              <button onClick={() => navigate(`/test/update/${test.id}`)}>
                View Test
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestsPage;
