const { Router } = require('express');
const CalendarEventController = require('../Controllers/calendarEventControler')
const authMiddleware = require('../middlewares/authMiddleware')
const router = new Router();


router.post('/add-calendar-event', authMiddleware, CalendarEventController.addCalendarEvent);
router.get('/get-calendar-event/:user_id', authMiddleware, CalendarEventController.getCalendarEvent)
router.delete('/delete-user-event/:user_id/:event_id', authMiddleware, CalendarEventController.deleteUserEvent)

module.exports = router;