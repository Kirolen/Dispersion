const CalendarEvent = require('../Models/CalendarEvent')
const User = require('../Models/User')

/**
 * @class CalendarEventController
 * @classdesc Handles creation and management of calendar events for users and courses.
 *
 * ### Features:
 * - Create, fetch, and delete calendar events.
 * - Assign events to courses or individual users.
 * - Integrate due dates, test times, and custom events.
 *
 * @exports CalendarEventController
 */
class CalendarEventController {
    /**
     * Adds a new calendar event for a user.
     * Validates that the user exists before saving the event.
     * @param {import('express').Request} req - The request object.
     * @param {import('express').Response} res - The response object.
     * @returns {Promise<void>}
     */
    async addCalendarEvent(req, res) {
        try {
            const { user_id, title, eventType, startDate, endDate } = req.body;

            const userxists = await User.findById(user_id);
            if (!userxists) return res.status(404).json({ message: "User not found!" });

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

    /**
     * Retrieves all calendar events for a given user.
     * Converts event start and end dates to ISO string (UTC) format.
     * @param {import('express').Request} req - The request object.
     * @param {import('express').Response} res - The response object.
     * @returns {Promise<void>}
     */
    async getCalendarEvent(req, res) {
        try {
            const { user_id } = req.params;
            const events = await CalendarEvent.find({ user_id });

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


    /**
* Deletes a calendar event for a specific user.
* Checks if user and event exist and verifies event ownership.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>}
*/
    async deleteUserEvent(req, res) {
        const { user_id, event_id } = req.params;
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found!" });

        const event = await CalendarEvent.findOne({ _id: event_id, user_id });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found or does not belong to the user." });
        }

        await CalendarEvent.deleteOne({ _id: event_id });

        return res.status(200).json({ success: true, message: "Event successfully deleted." });
    }
}

module.exports = new CalendarEventController();