import React, { useEffect, useState } from 'react';
import './CalendarPage.css';
import { addCalendarEvent, getCalendarEvents } from '../../api/calendarEventService';
import { useSelector } from 'react-redux';

const CalendarPage = () => {
  const { user_id } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'Meeting' });

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user_id) return;
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

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <button className="add-event-button" onClick={() => setShowEventForm(true)}>Add Event</button>
      </div>
      <div className="calendar-content">
        <div className="events-list">
          {events.map((event) => (
            <div key={event._id} className={`event-card ${event.eventType}`}>
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="event-type">{event.eventType}</span>
              </div>
              <div className="event-time">
                <span>Start: {new Date(event.startDate).toLocaleString()}</span>
                <span>End: {new Date(event.endDate).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        {showEventForm && (
          <div className="event-form-overlay">
            <div className="event-form">
              <h2>Add New Event</h2>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Start Date & Time</label>
                  <input type="datetime-local" value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Date & Time</label>
                  <input type="datetime-local" value={newEvent.end} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                    <option value="Meeting">Meeting</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Test">Test</option>
                  </select>
                </div>
                <div className="form-actions">
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
