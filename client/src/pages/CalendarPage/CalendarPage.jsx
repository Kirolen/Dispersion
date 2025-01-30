import React, { useState } from 'react';
import './CalendarPage.css';
import { mockCalendarEvents } from '../../mockData/mockData';

const CalendarPage = () => {
  const [events, setEvents] = useState(mockCalendarEvents);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    type: 'meeting'
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      id: Date.now().toString(),
      ...newEvent
    };
    setEvents([...events, event]);
    setShowEventForm(false);
    setNewEvent({ title: '', start: '', end: '', type: 'meeting' });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <button className="add-event-button" onClick={() => setShowEventForm(true)}>
          Add Event
        </button>
      </div>

      <div className="calendar-content">
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className={`event-card ${event.type}`}>
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className="event-type">{event.type}</span>
              </div>
              <div className="event-time">
                <span>Start: {new Date(event.start).toLocaleString()}</span>
                <span>End: {new Date(event.end).toLocaleString()}</span>
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
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="assignment">Assignment</option>
                    <option value="test">Test</option>
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