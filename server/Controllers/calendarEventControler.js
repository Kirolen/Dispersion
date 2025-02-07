const CalendarEvent = require('../Models/CalendarEvent')
const User = require('../Models/User')

class CalendarEventController {
    async addCalendarEvent(req, res) {
        try {
            const { user_id, title, eventType, startDate, endDate } = req.body;

            const userxists = await User.findById(user_id);
            if (!userxists) {
                console.log("❌ User not found");
                return null;
            }

            const newCalendarEvent = new CalendarEvent({
                user_id, 
                title, 
                eventType, 
                startDate, 
                endDate
            });

            await newCalendarEvent.save();
            return res.status(201).json(newCalendarEvent);

        } catch (error) {
            console.error("❌ Error adding calendar event:", error);
            return res.status(500).json({ message: 'Error adding calendar event' });
        }
    }

    async getCalendarEvent(req, res) {
        try {
            const events = await CalendarEvent.find(); 

            const eventsInUTC = events.map(event => {
                return {
                    ...event.toObject(),
                    startDate: new Date(event.startDate).toISOString(), 
                    endDate: new Date(event.endDate).toISOString()    
                };
            });

            res.status(200).json(eventsInUTC);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            return res.status(500).json({ message: 'Error fetching calendar events' });
        }
    }
}

module.exports = new CalendarEventController();