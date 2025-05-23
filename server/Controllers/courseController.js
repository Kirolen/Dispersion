const { validationResult } = require('express-validator');
const Course = require('../Models/Course');
const User = require('../Models/User');
const Chat = require('../Models/Chat')
const CourseAccess = require('../Models/CourseAccess')
const CourseOwner = require('../Models/CourseOwner');

/**
 * @class courseController
 * @classdesc Manages course-related actions including creation, enrollment, and course listings.
 *
 * ### Features:
 * - Create and update course details.
 * - Handle student enrollment and role-based access.
 * - Retrieve teacher or student courses with relevant data.
 *
 * @exports courseController
 */
class courseController {
    /**
    * Adds a new course to the system.
    * 
    * Validates request body, checks for existing course and valid teacher ID.
    * Creates the course, assigns the teacher as the owner, and creates a course chat group.
    * 
    * @param {Object} req - Express request object, expects body with:
    *   - {string} course_name - Name of the course.
    *   - {string} course_desc - Description of the course.
    *   - {string} teacher_id - ID of the teacher creating the course.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} Returns success message and created course data or error info.
    */
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

            const courseOwner = new CourseOwner({ course_id, teacher_id })
            await courseOwner.save();

            const courseChat = new Chat({
                members: [teacher_id],
                isGroup: true,
                isCourseChat: course_id,
                groupName: course_name,
                createdBy: teacher_id,
                isActiveFor: [teacher_id]
            })

            await courseChat.save()

            res.status(201).json({
                success: true,
                message: 'Course added successfully',
                data: course
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Add course error', error });
        }
    }

    /**
     * Enrolls a user (student) into a course.
     * 
     * Validates the user and course exist, checks if user already enrolled.
     * Adds user to course access list and updates the course chat group members.
     * 
     * @param {Object} req - Express request object, expects body with:
     *   - {string} user_id - ID of the student joining the course.
     *   - {string} course_id - ID of the course to join.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} Returns success or error message.
     */
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

            const existingEnrollment = await CourseAccess.findOne({ student_id: user_id, course_id });
            if (existingEnrollment) {
                return res.status(400).json({ success: false, message: 'User already enrolled in this course' });
            }

            const enrollment = new CourseAccess({ student_id: user_id, course_id });
            await enrollment.save();

            let chat = await Chat.findOne({ isCourseChat: course_id });
            if (chat) {
                chat.members.push(user_id);
                chat.isActiveFor.push(user_id);
                await chat.save();
            }

            res.json({ success: true, message: 'User successfully joined the course' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error joining the course', error });
        }
    }

    /**
    * Retrieves all students enrolled in a specific course.
    * 
    * Validates course existence and fetches all students enrolled by querying course access.
    * 
    * @param {Object} req - Express request object, expects body with:
    *   - {string} course_id - ID of the course.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} Returns list of students or error message.
    */
    async getStudentsByCourse(req, res) {
        try {
            const { course_id } = req.body;

            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            const enrollments = await CourseAccess.find({ course_id }).populate('student_id', 'first_name last_name email');
            const students = enrollments.map((enrollment) => enrollment.student_id);

            res.json({ success: true, data: students });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching students for the course', error });
        }
    }

    /**
    * Retrieves all courses associated with the authenticated user.
    * 
    * For students, it returns courses they are enrolled in along with teacher info,
    * chat IDs, and student counts.
    * For teachers, it returns courses they own with similar details.
    * 
    * @param {Object} req - Express request object, expects `req.user` with authenticated user info.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} JSON response with list of courses or error.
    */
    async getAllCourses(req, res) {
        try {
            const user = req.user;
            if (!user) {
                console.log("Error: User not found");
                return res.status(401).json({ success: false, message: "User not authenticated" });
            }

            const existUser = await User.findById(user.id);
            if (!existUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            if (existUser.role === "Student") {
                const enrollments = await CourseAccess.find({ student_id: existUser._id })
                    .populate({
                        path: "course_id",
                        select: "course_name course_desc",
                    });

                const courses = await Promise.all(
                    enrollments.map(async (enrollment) => {
                        const courseOwner = await CourseOwner.findOne({ course_id: enrollment.course_id._id })
                            .populate({
                                path: "teacher_id",
                                select: "first_name last_name",
                            });

                        const chat = await Chat.findOne({ isCourseChat: enrollment.course_id._id });
                        const students = await CourseAccess.find({ course_id: enrollment.course_id._id })

                        return {
                            course_id: enrollment.course_id._id,
                            course_name: enrollment.course_id.course_name,
                            course_desc: enrollment.course_id.course_desc,
                            teacher_name: courseOwner?.teacher_id
                                ? `${courseOwner.teacher_id.first_name} ${courseOwner.teacher_id.last_name}`
                                : "Unknown",
                            chatId: chat ? chat._id : null,
                            students: students.length
                        };
                    })
                );

                return res.json({ success: true, data: courses });

            } else if (existUser.role === "Teacher") {
                const courseOwners = await CourseOwner.find({ teacher_id: existUser._id })
                    .populate({
                        path: "course_id",
                        select: "course_name course_desc",
                    });

                const courses = await Promise.all(
                    courseOwners.map(async (courseOwner) => {
                        const chat = await Chat.findOne({ isCourseChat: courseOwner.course_id._id });
                        const students = await CourseAccess.find({ course_id: courseOwner.course_id._id })

                        return {
                            course_id: courseOwner.course_id._id,
                            course_name: courseOwner.course_id.course_name,
                            course_desc: courseOwner.course_id.course_desc,
                            teacher_name: `${existUser.first_name} ${existUser.last_name}`,
                            chatId: chat ? chat._id : null,
                            students: students.length
                        };
                    })
                );

                return res.json({ success: true, data: courses });

            } else {
                return res.status(403).json({ success: false, message: "Invalid user role" });
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ success: false, message: "Error fetching courses for the user", error });
        }
    }

    /**
    * Retrieves course information by its ID.
    * 
    * Finds the course and the associated chat ID.
    * 
    * @param {Object} req - Express request object, expects `req.params.courseId` as the course ID.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} JSON response with course name and chat ID or error.
    */
    async getCourseById(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Курс не знайдено' });
            }

            const chat = await Chat.findOne({ isCourseChat: courseId }).select("_id")

            const response = {
                course_name: course.course_name,
                chatId: chat._id
            };

            return res.json({ success: true, data: response });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Помилка при отриманні інформації про курс', error });
        }
    }

    /**
    * Retrieves people related to a specific course.
    * 
    * Returns the course's teacher information and all enrolled students.
    * 
    * @param {Object} req - Express request object, expects `req.params.courseId` as the course ID.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} JSON response with teacher and student data or error.
    */
    async getCoursePeople(req, res) {
        try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Курс не знайдено' });
            }
            const owner = await CourseOwner.findOne({ course_id: courseId }).populate('teacher_id', 'first_name last_name email');
            const enrollments = await CourseAccess.find({ course_id: courseId }).populate('student_id', 'first_name last_name email');

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
