const { validationResult } = require('express-validator');
const Course = require('../Models/Course');
const User = require('../Models/User');
const EnrollmentCourse = require('../Models/EnrollmentCourse')

class courseController {
    async addCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { course_name, teacher_id } = req.body;

            const teacher = await User.findById(teacher_id);
            if (!teacher) {
                return res.status(400).json({ success: false, message: 'Invalid teacher ID' });
            }

            const existingCourse = await Course.findOne({ course_name });
            if (existingCourse) {
                return res.status(400).json({ success: false, message: 'Course already exists' });
            }

            const course = new Course({ course_name, teacher_id });
            await course.save();

            res.status(201).json({
                success: true,
                message: 'Course added successfully',
                data: course
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Add course error', error });
        }
    }

    async joinCourse(req, res) {
        try {
            const { user_id, course_id } = req.body;

            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const existingEnrollment = await EnrollmentCourse.findOne({ student_id: user_id, course_id });
            if (existingEnrollment) {
                return res.status(400).json({ success: false, message: 'User already enrolled in this course' });
            }
    
            const enrollment = new EnrollmentCourse({ student_id: user_id, course_id });
            await enrollment.save();
    
            res.json({ success: true, message: 'User successfully joined the course' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error joining the course', error });
        }
    }

    async getStudentsByCourse(req, res) {
        try {
            const { course_id } = req.body;

            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const enrollments = await EnrollmentCourse.find({ course_id }).populate('student_id', 'first_name last_name email');
            const students = enrollments.map((enrollment) => enrollment.student_id);

            res.json({ success: true, data: students });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching students for the course', error });
        }
    }

    async getCourse(req, res) {
        try {
            const { user_id } = req.body;  
    
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            const enrollments = await EnrollmentCourse.find({ student_id: user_id }).populate('course_id', 'course_name teacher_id');
            const courses = enrollments.map((enrollment) => enrollment.course_id);
    
            res.json({ success: true, data: courses });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching courses for the user', error });
        }
    }
    

}

module.exports = new courseController();
