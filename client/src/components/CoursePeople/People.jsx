import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCoursePeople } from '../../api/courseService';
import styles from './People.module.css'
import { AiOutlineWechatWork } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { createChat } from '../../api/personalChatService';
import { setChatId } from '../../store/reducers/personalChatSlice';


const People = () => {
  const { courseId } = useParams();
  const [courseInfoPeople, setCourseInfoPeople] = useState(null);
  const {user_id} = useSelector(state => state.user)
  const {chatId} = useSelector(state => state.chat)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await getCoursePeople(courseId);
        console.log(res)
        setCourseInfoPeople(res);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const [chatOpenedManually, setChatOpenedManually] = useState(false);

  const handleStartChat  = async (id) => {
    if (id === user_id) return;
    const data = await createChat({ user1: user_id, user2: id });
    const chatId = data.chat._id;
    dispatch(setChatId(chatId));
    setChatOpenedManually(true);
  };
  
  useEffect(() => {
    if (chatOpenedManually && chatId) {
      navigate('/messages');
      setChatOpenedManually(false); 
    }
  }, [chatId, chatOpenedManually]);
  
  if (!courseInfoPeople) {
    return <div>Loading...</div>; 
  }

  return (
    <div className={styles.peopleContainer}>
      <div className={styles.teachersList}>
        <h2>Teachers</h2>
        {courseInfoPeople.teacher ? (
          <div className={styles.personCard}>
            <span className={styles.personName}>{courseInfoPeople.teacher.name}</span>
            <span className={styles.personEmail}>{courseInfoPeople.teacher.email}</span>
            <AiOutlineWechatWork className={styles.icon} onClick={() => handleStartChat(courseInfoPeople.teacher.id)}/>
          </div>
        ) : (
          <div className={styles.noContnet}>No teacher information available.</div>
        )}
      </div>
      <div className={styles.studentsList}>
        <h2>Students</h2>
        {courseInfoPeople.students?.length > 0 ? (
          courseInfoPeople.students.map((student, index) => (
            <div key={index} className={styles.personCard}>
              <span className={styles.personName}>{student.name}</span>
              <span className={styles.personEmail}>{student.email}</span>
              <AiOutlineWechatWork className={styles.icon} onClick={() => handleStartChat(student.id)}/>
            </div>
          ))
        ) : (
          <div className={styles.noContnet}>No students enrolled yet.</div>
        )}
      </div>
    </div>
  );
};

export default People;
