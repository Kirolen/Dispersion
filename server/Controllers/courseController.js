const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

const Course = require('../Models/Course');
const User = require('../Models/User');
const EnrollmentCourse = require('../Models/EnrollmentCourse')
const CourseOwner =  require('../Models/CourseOwner')
const {secret} = require('../Config/config')

class courseController {

    async addCourse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { course_name, course_desc, teacher_id } = req.body;

            const teacher = await User.findById(teacher_id);
            if (!teacher) {
                return res.status(400).json({ success: false, message: 'Invalid teacher ID' });
            }

            const existingCourse = await Course.findOne({ course_name });
            if (existingCourse) {
                return res.status(400).json({ success: false, message: 'Course already exists' });
            }

            const course = new Course({ course_name, course_desc });
            await course.save();
            const course_id = course.id

            const courseOwner = new CourseOwner({course_id, teacher_id})
            await courseOwner.save();

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

    async getAllCourses(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
    
            if (!token) {
                return res.status(400).json({ success: false, message: 'Token not provided' });
            }
    
            const decoded = jwt.verify(token, secret);
            const user_id = decoded.id;
    
            const user = await User.findById(user_id);
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            if (user.role === "Student") {
                const enrollments = await EnrollmentCourse.find({ student_id: user_id })
                    .populate({
                        path: 'course_id',
                        select: 'course_name course_desc',
                    });
    
                const courses = await Promise.all(
                    enrollments.map(async (enrollment) => {
                        const courseOwner = await CourseOwner.findOne({ course_id: enrollment.course_id._id }).populate({
                            path: 'teacher_id',
                            select: 'first_name last_name',
                        });
    
                        return {
                            course_id: enrollment.course_id._id,
                            course_name: enrollment.course_id.course_name,
                            course_desc: enrollment.course_id.course_desc,
                            teacher_name: courseOwner?.teacher_id
                                ? `${courseOwner.teacher_id.first_name} ${courseOwner.teacher_id.last_name}`
                                : 'Unknown',
                        };
                    })
                );
    
                return res.json({ success: true, data: courses });
    
            } else if (user.role === "Teacher") {
                const courseOwners = await CourseOwner.find({ teacher_id: user_id })
                    .populate({
                        path: 'course_id',
                        select: 'course_name course_desc',
                    });
    
                const courses = courseOwners.map((courseOwner) => ({
                    course_id: courseOwner.course_id._id,
                    course_name: courseOwner.course_id.course_name,
                    course_desc: courseOwner.course_id.course_desc,
                    teacher_name: `${user.first_name} ${user.last_name}`,
                }));
    
                return res.json({ success: true, data: courses });
    
            } else {
                return res.status(403).json({ success: false, message: 'Invalid user role' });
            }
    
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching courses for the user', error });
        }
    }
    
    async getCourseById(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Курс не знайдено' });
            }

            const response = {
                course_name: course.course_name
            };
    
            return res.json({ success: true, data: response });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Помилка при отриманні інформації про курс', error });
        }
    } 

    async getCoursePeople(req, res) {
        try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Курс не знайдено' });
            }
            const owner = await CourseOwner.findOne({ course_id: courseId }).populate('teacher_id', 'first_name last_name email');
            const enrollments = await EnrollmentCourse.find({ course_id: courseId }).populate('student_id', 'first_name last_name email');
    
            const students = enrollments.map((enrollment) => ({
                id: enrollment.student_id._id,
                name: `${enrollment.student_id.first_name} ${enrollment.student_id.last_name}`,
                email: enrollment.student_id.email,
            }));
    
            const response = {
                course_name: course.course_name,
                teacher: owner ? {
                    id: owner.teacher_id._id,
                    name: `${owner.teacher_id.first_name} ${owner.teacher_id.last_name}`,
                    email: owner.teacher_id.email,
                } : null,
                students,
            };
            
            return res.json({ success: true, data: response });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error retrieving data!', error });
        }
    }
}

module.exports = new courseController();
