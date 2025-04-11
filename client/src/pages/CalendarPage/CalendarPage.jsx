import React, { useEffect, useState } from 'react';
import styles from './CalendarPage.module.css';
import { addCalendarEvent, getCalendarEvents, deleteUserEvent } from '../../api/calendarEventService';
import { useSelector } from 'react-redux';
import { AiFillDelete } from "react-icons/ai";

const CalendarPage = () => {
  const { user_id } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'Meeting' });

  useEffect(() => {
    const fetchEvents = async () => {
      if (user_id.toString() === "-1") return;
      try {
        const fetchedEvents = await getCalendarEvents(user_id);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };
    fetchEvents();
  }, [user_id]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const addedEvent = await addCalendarEvent(
        user_id,
        newEvent.title,
        newEvent.type,
        new Date(newEvent.start).toISOString(),
        new Date(newEvent.end).toISOString()
      );
      setEvents([...events, addedEvent]);
      setShowEventForm(false);
      setNewEvent({ title: '', start: '', end: '', type: 'Meeting' });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await deleteUserEvent(user_id, eventId);
      if (response.success) setEvents(prev => prev.filter((event) => event._id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h1>Calendar</h1>
        <button className={styles.addEventButton} onClick={() => setShowEventForm(true)}>Add Event</button>
      </div>
      <div className={styles.calendarContent}>
        <div className={styles.eventsList}>
          {events.length === 0 && <p>No event available</p>}
          {events.map((event) => (
            <div key={event._id} className={`${styles.eventCard} ${styles[event.eventType]}`}>
              <div className={styles.eventHeader}>
                <h3>{event.title}</h3>
                <span className={styles.eventType}>{event.eventType}</span>
              </div>
              <div className={styles.eventTime}>
                <span>Start: {new Date(event.startDate).toLocaleString()}</span>
                <span>End: {new Date(event.endDate).toLocaleString()}</span>
              </div>
              <button className={styles.deleteEventButton} onClick={() => deleteEvent(event._id)}><AiFillDelete/></button>
            </div>
          ))}
        </div>
        {showEventForm && (
          <div className={styles.eventFormOverlay}>
            <div className={styles.eventForm}>
              <h2>Add New Event</h2>
              <form onSubmit={handleAddEvent}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Start Date & Time</label>
                  <input type="datetime-local" value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date & Time</label>
                  <input type="datetime-local" value={newEvent.end} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Event Type</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                    <option value="Meeting">Meeting</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Test">Test</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="submit">Add Event</button>
                  <button type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
