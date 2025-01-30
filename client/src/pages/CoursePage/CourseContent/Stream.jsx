import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockCourses } from "../../../mockData/mockData";
import {getCourseChat, addMessage} from '../../../api//courseService'


const Stream = (props) => {
    const [announcement, setAnnouncement] = useState('');
    const [localAnnouncements, setLocalAnnouncements] = useState([]);
    const {courseId } = useParams();

    useEffect(() => {
        const fetchCourseDetails = async () => {
         try {
            if (courseId === "1") {
                setLocalAnnouncements(mockCourses()[0].announcements);
            }
        else {
          const res = await getCourseChat(courseId);
          console.log(res)
          setLocalAnnouncements(res)
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

    const handleAnnouncementSubmit = async () => {
        if (!announcement.trim()) return;
        
        const res = await addMessage(courseId, announcement)
        const newAnnouncement = {
          message: announcement,
          author: props.username || "",
          date: new Date().toLocaleString()
        };
    
        setLocalAnnouncements([newAnnouncement, ...localAnnouncements]);
        setAnnouncement('');
      };
    

    return (<div className="stream-section">
      <div className="announcement-box">
        <input
          type="text"
          placeholder="Share something with your class..."
          className="announcement-input"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
        <button className="post-button" onClick={handleAnnouncementSubmit}>Post</button>
      </div>
      <div className="stream-feed">
        {localAnnouncements.map((announcement, index) => (
          <div key={announcement.id || index} className="announcement-card">
            <div className="announcement-header">
              <span className="author">{announcement.author || ""}</span>
              <span className="date">{announcement.created_at || ""}</span>
            </div>
            <p className="announcement-content">{announcement.message || ""}</p>
          </div>
        ))}
      </div>
    </div>)
  }

  export default Stream