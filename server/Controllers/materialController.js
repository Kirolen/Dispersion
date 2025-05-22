const Material = require('../Models/Material');
const AssignedUsers = require('../Models/AssignedUsers');
const User = require("../Models/User");
const CourseOwner = require("../Models/CourseOwner")
const mongoose = require('mongoose');
const CourseAccess = require('../Models/CourseAccess');
const TestSession = require('../Models/TestSession');
const Test = require('../Models/Test');

/**
 * Generates a test session for a specific user based on the provided test and test properties.
 * 
 * It selects questions either randomly by type or takes all questions,
 * calculates the total score, and creates a TestSession document.
 * 
 * @param {mongoose.Types.ObjectId|string} userId - ID of the user for whom to generate the test session.
 * @param {mongoose.Types.ObjectId|string} materialId - ID of the material related to the test.
 * @param {mongoose.Types.ObjectId|string} testId - ID of the test to generate a session for.
 * @param {Object} testProperties - Properties that control test generation, e.g. randomization and question counts.
 * @param {boolean} testProperties.isRandomQuestions - Whether to randomize questions or not.
 * @param {Object} testProperties.questionCountByType - Number of questions to select per question type.
 * @param {Date} testProperties.endDate - The end date of the test (not used directly here but typically important).
 * 
 * @returns {Promise<Object>} The created TestSession document.
 * @throws Will throw an error if the test is not found or any DB operation fails.
 */
async function generateTestSessionForUser(userId, materialId, testId, testProperties) {
    try {
        const test = await Test.findById(testId);
        if (!test) throw new Error("Test not found");

        let selectedQuestions = [];

        if (testProperties.isRandomQuestions) {
            const groupedByType = {
                single: [],
                multiple: [],
                short: [],
                long: []
            };

            for (const question of test.questions) {
                groupedByType[question.type]?.push(question);
            }

            for (const [type, count] of Object.entries(testProperties.questionCountByType)) {
                const questionsOfType = groupedByType[type] || [];
                const shuffled = questionsOfType.sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, count);
                selectedQuestions.push(...selected);
            }
        } else {
            selectedQuestions = test.questions;
        }

        const totalScore = selectedQuestions.reduce((sum, q) => sum + q.qPoints, 0);

        const sessionQuestions = selectedQuestions.map((q) => ({
            originalQuestionId: q._id,
            question: q.question,
            type: q.type,
            options: q.options,
            images: q.images,
            points: q.qPoints
        }));

        const testSession = await TestSession.create({
            user: userId,
            test: test.id,
            material: materialId,
            questions: sessionQuestions,
            totalScore: totalScore,
            startedAt: null
        });

        return testSession;

    } catch (error) {
        console.error("❌ Failed to generate test session:", error);
        throw error;
    }
}

/**
 * @class materialController
 * @classdesc Manages course materials including assignments, practices, and attached resources.
 *
 * ### Features:
 * - Create, retrieve, update, and delete course materials.
 * - Fetch all assignments for a course by teacher.
 * - Assign materials to students and manage their statuses.
 *
 * @exports materialController
 */
class materialController {
    /**
     * Adds a new material or task.
     * 
     * Creates a material document and assigns it to users if the type requires.
     * For tests, generates test sessions for assigned users.
     * 
     * @param {Object} req - Express request object; expects body with material/task details.
     * @param {Object} req.body - Body of the request containing material info.
     * @param {string} req.body.title - Title of the material.
     * @param {string} req.body.description - Description of the material.
     * @param {string} req.body.type - Type of the material (e.g., 'material', 'practice_with_test').
     * @param {Date} [req.body.dueDate] - Due date for the material.
     * @param {number} req.body.points - Points for the material.
     * @param {string} req.body.course_id - ID of the related course.
     * @param {Array<string>} req.body.assignedStudents - Array of user IDs assigned to the material.
     * @param {Array<Object>} [req.body.attachments] - Attached files or resources.
     * @param {Date} [req.body.availableFrom] - When material becomes available.
     * @param {boolean} [req.body.isAvailableToAll] - Whether material is available to all students.
     * @param {string} [req.body.test] - Test ID if material includes a test.
     * @param {Object} [req.body.testProperties] - Test generation properties.
     * 
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} JSON response with success or error message.
     */
    async addTask(req, res) {
        try {
            const { title, description, type, dueDate, points, course_id, assignedStudents: assignedUsers, attachments, availableFrom, isAvailableToAll, test, testProperties } = req.body;

            const newMaterial = await Material.create({
                title,
                description,
                type,
                dueDate: dueDate || testProperties.endDate,
                points,
                course_id,
                attachments,
                availableFrom,
                isAvailableToAll: type === "material" ? true : isAvailableToAll,
                test: {
                    test: test,
                    testProperties: testProperties
                }
            });

            if (type !== 'material') {
                for (const userId of assignedUsers) {
                    const existingAssignment = await AssignedUsers.findOne({ user_id: userId, material_id: newMaterial._id });

                    if (!existingAssignment) {
                        await AssignedUsers.create({ user_id: userId, material_id: newMaterial._id });
                    }
                    if (test) {
                        await generateTestSessionForUser(userId, newMaterial._id, test, testProperties);
                    }
                }
            }

            return res.status(201).json({ success: true, message: "✅ Material added successfully", data: newMaterial });

        } catch (error) {
            console.error("❌ Error adding material:", error);
            return res.status(500).json({ success: false, message: "❌ Error adding material", error });
        }
    }

    /**
     * Deletes a material and all related assignments and test sessions if applicable.
     * 
     * @param {Object} req - Express request object.
     * @param {string} req.params.assignmentId - ID of the material to delete.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} JSON response with success or error message.
     */
    async deleteAssignment(req, res) {
        try {
            const assignmentID = req.params.assignmentId;

            const material = await Material.findById(assignmentID);
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }

            if (material.type !== 'material') await AssignedUsers.deleteMany({ material_id: assignmentID });
            if (material.type === 'practice_with_test') await TestSession.deleteMany({ test: material.test.test, material: assignmentID})

            await Material.findByIdAndDelete(assignmentID);

            return res.status(201).json({ success: true, message: "✅ Material delete successfully" });

        } catch (error) {
            console.error("❌ Error delete material:", error);
            return res.status(500).json({ success: false, message: "❌ Error delete material", error });
        }
    }

    /**
   * Retrieves detailed information about a specific material,
   * including assigned students and test properties if applicable.
   * 
   * @param {Object} req - Express request object.
   * @param {string} req.params.assignmentId - ID of the material to fetch.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} JSON response with material details or error.
   */
    async getMaterialInfo(req, res) {
        try {
            const assignmentID = req.params.assignmentId;
            const material = await Material.findById(assignmentID)
            if (!material) return res.status(404).json({ success: false, message: "❌ Material not found", error });

            const assignedUsers = await AssignedUsers.find({ material_id: assignmentID })
            const assignedStudents = assignedUsers.map(student => {
                return student.user_id.toString();
            })

            const reformedMaterial = {
                title: material.title,
                description: material.description,
                points: material.points,
                ueDateOption: material.dueDate ? 'set' : 'none',
                dueDate: material.dueDate ? material.dueDate : '',
                availableFromOption: material.availableFrom ? 'set' : 'none',
                availableFrom: material.availableFrom ? material.availableFrom : '',
                assignToAll: material.isAvailableToAll,
                attachments: material.attachments || [],
                assignedStudents: assignedStudents || [],
                searchQuery: '',
                test: material.test.test
            }

            return res.status(200).json({ success: true, reformedMaterial, testProperties: material.test.testProperties })
        } catch (error) {
            return res.status(500).json({ success: false, message: "❌ Error getting material info", error });
        }
    }

    /**
     * Updates the information of a material,
     * including updating assigned students and test properties.
     * 
     * @param {Object} req - Express request object.
     * @param {string} req.params.assignmentId - ID of the material to update.
     * @param {Object} req.body - Updated material properties.
     * @param {string} req.body.title - Updated title.
     * @param {string} req.body.description - Updated description.
     * @param {string} req.body.type - Updated material type.
     * @param {Date} req.body.dueDate - Updated due date.
     * @param {number} req.body.points - Updated points.
     * @param {string} req.body.course_id - Updated course ID.
     * @param {Array<string>} req.body.assignedStudents - Updated list of assigned students.
     * @param {Array<Object>} req.body.attachments - Updated attachments.
     * @param {Date} req.body.availableFrom - Updated availability start date.
     * @param {boolean} req.body.isAvailableToAll - Updated availability flag.
     * @param {string} req.body.test - Updated test ID.
     * @param {Object} req.body.testProperties - Updated test properties.
     * 
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} JSON response with updated material data or error.
     */
    async updateMaterialInfo(req, res) {
        try {
            const { title, description, type, dueDate, points, course_id, assignedStudents: assignedUsers, attachments, availableFrom, isAvailableToAll, test, testProperties } = req.body;
            const assignmentID = req.params.assignmentId;

            const material = await Material.findById(assignmentID);
            if (!material) return res.status(404).json({ success: false, message: "❌ Material not found" });

            const newTest = {
                test: test,
                testProperties: testProperties
            }
            const endDate = (type === "practice_with_test") ? testProperties.endDate : dueDate

            const updatedMaterial = await Material.findByIdAndUpdate(
                assignmentID,
                { title, description, type, dueDate: endDate, points, course_id, attachments, availableFrom, isAvailableToAll, test: newTest },
                { new: true }
            );

            if (type !== "material") {
                const pastAssignedUsers = await AssignedUsers.find({ material_id: assignmentID });
                const assignedStudents = pastAssignedUsers.map(student => student.user_id.toString());

                const studentsToRemove = assignedStudents.filter(student => !assignedUsers.includes(student));
                const studentsToAdd = assignedUsers.filter(student => !assignedStudents.includes(student));

                for (const studentId of studentsToRemove) {
                    await AssignedUsers.deleteOne({ user_id: studentId, material_id: assignmentID });
                }

                for (const studentId of studentsToAdd) {
                    const existingAssignment = await AssignedUsers.findOne({ user_id: studentId, material_id: assignmentID });
                    if (!existingAssignment) {
                        await AssignedUsers.create({ user_id: studentId, material_id: assignmentID });
                    }
                }
            }

            return res.status(200).json({ success: true, message: "✅ Material updated successfully", data: updatedMaterial });
        } catch (error) {
            console.error("❌ Error updating material:", error);
            return res.status(500).json({ success: false, message: "❌ Error updating material", error });
        }
    }

    /**
  * Retrieves all published course materials for a specific student.
  *
  * @param {object} req - Express request object, expects `courseId` param and `userId` query.
  * @param {object} res - Express response object.
  * @returns {Promise<void>} - Sends list of available materials or error.
  */
    async getCourseMaterialsForStudent(req, res) {
        try {
            const { courseId } = req.params;
            const { userId } = req.query;

            const assignedMaterials = await AssignedUsers.find({ user_id: userId }).select('material_id');
            const materialIds = assignedMaterials.map(a => a.material_id);

            const materials = await Material.find({
                course_id: courseId,
                $or: [
                    { _id: { $in: materialIds } },
                    { type: 'material' }
                ]
            }).sort({ createdAt: -1 });

            const available = materials.filter(material => materialIds.availableFrom === null || material.availableFrom <= Date.now())

            return res.status(200).json({ success: true, data: available });

        } catch (error) {
            console.error("❌ Error fetching assignments:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching assignments", error });
        }
    }

    /**
     * Retrieves all course materials (for teacher access).
     *
     * @param {object} req - Express request object, expects `courseId` param.
     * @param {object} res - Express response object.
     * @returns {Promise<void>} - Sends list of materials or error.
     */
    async getAllCourseMaterials(req, res) {
        try {
            let { courseId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid course ID" });
            }

            const assignments = await Material.find({ course_id: courseId });

            return res.status(200).json({ success: true, data: assignments.reverse() });

        } catch (error) {
            console.error("❌ Error fetching all assignments:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching all assignments", error });
        }
    }

    /**
  * Retrieves detailed task information for a specific student and material.
  * Includes submission status and test session completion status.
  *
  * @param {object} req - Express request object, expects `materialId` param and `userId` query.
  * @param {object} res - Express response object.
  * @returns {Promise<void>} - Sends material and student-specific info or error.
  */
    async getStudentTaskInfo(req, res) {
        try {
            let { materialId } = req.params;
            let { userId } = req.query;
            userId = userId.trim()
            if (!mongoose.Types.ObjectId.isValid(materialId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid material ID" });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid user ID" });
            }
            const material = await Material.findById(materialId).lean();
            console.log("Material found...")
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }

            const userAssignment = await AssignedUsers.findOne({ material_id: materialId, user_id: userId })
                .select("grade attachments status response")
                .lean();

            if (material?.test?.test) {
                console.log(userId, materialId)
                const testStatusForStudent = await TestSession.findOne({ user: userId, material: materialId})
                console.log(testStatusForStudent)
                material.test.isCompleted = testStatusForStudent?.isCompleted || false;
            }

            return res.status(200).json({
                success: true,
                data: {
                    ...material,
                    userDetails: userAssignment || null
                }
            });

        } catch (error) {
            console.error("❌ Error fetching material info:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching material info", error });
        }
    }

    /**
    * Retrieves a list of assignments with submission and grading status for a student in a course.
    *
    * @param {object} req - Express request object, expects `courseId` param and `userId` query.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Sends status of all tasks or error.
    */
    async getStudentTasksResult(req, res) {
        try {
            const { courseId } = req.params;
            const { userId } = req.query;

            const assignedMaterials = await AssignedUsers.find({ user_id: userId }).select('material_id');
            const materialIds = assignedMaterials.map(a => a.material_id);

            const assignments = await Material.find({
                course_id: courseId,
                $or: [{ _id: { $in: materialIds } }]
            }).sort({ createdAt: -1 });

            const tasksStatus = await Promise.all(assignments.map(async (assignment) => {
                const assignedUser = await AssignedUsers.findOne({
                    user_id: userId,
                    material_id: assignment._id
                });

                return {
                    _id: assignment._id,
                    title: assignment.title,
                    grade: assignedUser ? assignedUser.grade || 'Not graded' : 'Not graded',
                    status: assignedUser ? assignedUser.status || 'Not submitted' : 'Not submitted'
                };
            }));

            return res.status(200).json({
                success: true,
                data: tasksStatus
            });

        } catch (error) {
            console.error("❌ Error fetching material info:", error);
            return res.status(500).json({
                success: false,
                message: "❌ Error fetching material info",
                error
            });
        }
    }

    /**
    * Submits a student's assignment and updates status depending on due date.
    *
    * @param {object} req - Express request object, expects `material_id` and `user_id` in body.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Sends confirmation of submission or error.
    */
    async submitSubmission(req, res) {
        try {
            const { material_id, user_id } = req.body;
            console.log(material_id)
            console.log(user_id)
            const material = await Material.findById(material_id);
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Завдання не знайдено" });
            }

            const curDate = new Date();
            const checkStatus = curDate > material.dueDate ? "passed_with_lateness" : "passed_in_time";

            const submission = await AssignedUsers.findOneAndUpdate(
                { material_id, user_id },
                {
                    status: checkStatus,
                    submitted_at: curDate,
                    grade: null,
                },
                { new: true, upsert: true }
            );

            return res.status(200).json({
                success: true,
                message: "✅ Завдання успішно здано",
                data: submission,
            });
        } catch (error) {
            console.error("❌ Помилка при здачі завдання:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }

    /**
    * Reverts a student's submission status, e.g., for resubmission after teacher feedback.
    *
    * @param {object} req - Express request object, expects `material_id` and `user_id` in params.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Sends reverted submission status or error.
    */
    async getSubmission(req, res) {
        try {
            const { material_id, user_id } = req.params;
            const submission = await AssignedUsers.findOneAndUpdate(
                { material_id, user_id },
                {
                    status: "not_passed",
                    submitted_at: null,
                    grade: null,
                },
                { new: true, upsert: true }
            );

            if (!submission) {
                return res.status(404).json({ success: false, message: "❌ Завдання не знайдено" });
            }

            return res.status(200).json({
                success: true,
                message: "✅ Завдання повернуто та файли оброблені",
                data: submission,
            });

        } catch (error) {
            console.error("❌ Помилка при отриманні та обробці завдання:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }

    /**
    * Updates a student's task submission by attaching new files.
    *
    * @param {object} req - Express request object. Requires `material_id`, `user_id`, and `files` in the body.
    * @param {object} res - Express response object.
    *  @returns {Promise<void>} - Responds with the updated submission or an error.
    */
    async updateStudentTask(req, res) {
        try {
            const { material_id, user_id, files } = req.body;

            const submission = await AssignedUsers.findOne({ material_id, user_id });

            submission.attachments = files

            submission.save();

            return res.status(200).json({
                success: true,
                message: "✅ Завдання змінено оцінено",
                data: submission
            });

        } catch (error) {
            console.error("❌ Помилка при змінені завдання:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }

    /**
    * Grades a student's task submission and optionally includes a message from the teacher.
    *
    * @param {object} req - Express request object. Requires `material_id`, `student_id`, `teacher_id`, `grade`, and `message` in the body.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Responds with the graded submission or an error.
    */

    async gradeTask(req, res) {
        try {
            const { material_id, student_id, teacher_id, grade, message } = req.body;
            const material = await Material.findById(material_id);
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Завдання не знайдено" });
            }

            console.log(message)
            const teacher = await User.findById(teacher_id);
            if (!teacher) {
                return res.status(404).json({ success: false, message: "❌ Вчитель не знайдений" });
            }

            const submission = await AssignedUsers.findOneAndUpdate(
                { material_id, user_id: student_id },
                {
                    status: "graded",
                    grade: grade,
                    response: { message: message, name: `${teacher.first_name} ${teacher.last_name}` }
                },
                { new: true }
            );

            if (!submission) {
                return res.status(404).json({ success: false, message: "❌ Подання не знайдено" });
            }

            return res.status(200).json({
                success: true,
                message: "✅ Завдання успішно оцінено",
                data: submission
            });

        } catch (error) {
            console.error("❌ Помилка при оцінюванні завдання:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }

    /**
    * Retrieves assignments filtered by status (e.g., submitted, passed) for each course a teacher manages.
    *
    * @param {object} req - Express request object. Requires `userId` param and optional `filterValue` query (e.g., "graded", "passed").
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Responds with a list of courses, tasks, and filtered student data.
    */
    async getFilteredAssignmentsByTeacher(req, res) {
        try {
            const { userId } = req.params;
            const { filterValue } = req.query;

            const teacher = await User.findById(userId);
            if (!teacher) return res.status(404).json({ success: false, message: "❌ Teacher not found" });

            const courseOwners = await CourseOwner.find({ teacher_id: userId }).populate("course_id", "course_name course_desc");

            const coursesWithTasks = await Promise.all(courseOwners.map(async ({ course_id }) => {
                const assignments = await Material.find({ course_id: course_id._id, type: { $in: ["practice", "practice_with_test"] } }).select("title").lean();

                const tasks = await Promise.all(assignments.map(async (assignment) => {
                    const assignedUsers = await AssignedUsers.find({ material_id: assignment._id }).populate("user_id").lean();
                    let students = assignedUsers.map(({ user_id, grade = "Not graded", status = "Not submitted" }) => ({
                        user_id: user_id._id,
                        name: user_id.first_name + " " + user_id.last_name,
                        grade,
                        status
                    }));

                    if (filterValue) {
                        if (filterValue === "passed") {
                            students = students.filter(student => student.status === "passed_with_lateness" || student.status === "passed_in_time");
                        } else {
                            students = students.filter(student => student.status === filterValue);
                        }
                    }

                    if (students.length === 0) return null;

                    return {
                        _id: assignment._id,
                        title: assignment.title,
                        points: assignment.points,
                        students
                    };
                }));

                const filteredTasks = tasks.filter(task => task !== null);
                if (filteredTasks.length === 0) return null;

                return { course_id: course_id._id, course_name: course_id.course_name, tasks: filteredTasks };
            }));

            const filteredCoursesWithTasks = coursesWithTasks.filter(course => course !== null);

            res.status(200).json({ success: true, data: filteredCoursesWithTasks });
        } catch (error) {
            console.error("❌ Error fetching courses with tasks:", error);
            res.status(500).json({ success: false, message: "❌ Server error", error });
        }
    }

    /**
    * Retrieves all assignments (practice and practice_with_test) for a specific course taught by a teacher.
    * Each assignment includes basic student info, grade, and status.
    *
    * @param {object} req - Express request object. Requires `userId` and `courseId` as route parameters.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Responds with an array of tasks and their student submission data or an error.
    */
    async getAllAssignmentsForOneCourseByTeacher(req, res) {
        try {
            const { userId, courseId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid user or course ID" });
            }

            const teacher = await User.findById(userId);
            if (!teacher) {
                return res.status(404).json({ success: false, message: "❌ Teacher not found" });
            }

            const assignments = await Material.find({ course_id: courseId, type: { $in: ["practice", "practice_with_test"] } })
                .select("title points")
                .lean();

            const tasks = await Promise.all(assignments.map(async (assignment) => {
                const assignedUsers = await AssignedUsers.find({ material_id: assignment._id })
                    .populate("user_id", "first_name last_name")
                    .lean();

                const students = assignedUsers.map(({ user_id, grade = "Not graded", status = "Not submitted" }) => ({
                    user_id: user_id._id,
                    name: `${user_id.first_name} ${user_id.last_name}`,
                    grade,
                    status
                }));

                return {
                    _id: assignment._id,
                    title: assignment.title,
                    points: assignment.points || 0,
                    students
                };
            }));

            return res.status(200).json({ success: true, data: tasks });
        } catch (error) {
            console.error("❌ Error getting teacher assignments:", error);
            return res.status(500).json({
                success: false,
                message: "❌ Error retrieving assignments",
                error: error.message
            });
        }
    }

    /**
    * Retrieves filtered assignments for a specific student across all enrolled courses.
    * Filters may include: `graded`, `passed`, `not_passed`, or `all`.
    *
    * @param {object} req - Express request object. Requires `userId` as a route parameter and optional `filterValue` query.
    * @param {object} res - Express response object.
    * @returns {Promise<void>} - Responds with filtered tasks per course or an error.
    */
    async getFilteredAssignmentsByStudent(req, res) {
        const { userId } = req.params;
        let { filterValue } = req.query;

        if (filterValue === "all") filterValue = "";

        const student = await User.findById(userId);
        if (!student) {
            return res.status(404).json({ success: false, message: "❌ Student not found" });
        }

        const enrolledCourses = await CourseAccess.find({ student_id: userId })
            .populate("course_id", "course_name course_desc");

        const coursesWithTasks = await Promise.all(enrolledCourses.map(async ({ course_id }) => {
            const practiceAssignments = await Material.find({
                course_id: course_id._id,
                type: { $in: ["practice", "practice_with_test"] }
            }).select("title points dueDate").lean();

            const tasks = await Promise.all(practiceAssignments.map(async (assignment) => {
                let filter;

                if (filterValue === "graded") filter = ['graded']
                else if (filterValue === "passed") filter = ['passed_in_time', 'graded', 'passed_with_lateess']
                else if (filterValue === "not_passed") filter = ['not_passed']
                else filter = ['passed_in_time', 'graded', 'not_passed', 'passed_with_lateness'];

                let submission = await AssignedUsers.findOne({
                    material_id: assignment._id,
                    user_id: userId,
                    status: { $in: filter }
                }).lean();

                if (!submission) return null;
                const { material_id, response, grade, status } = submission;

                return {
                    material_id,
                    title: assignment.title,
                    points: assignment.points,
                    dueDate: assignment.dueDate,
                    response,
                    grade,
                    status,
                };
            }));

            const nonEmptyTasks = tasks.filter(task => task !== null);
            if (nonEmptyTasks.length === 0) return null;

            return {
                course_id: course_id._id,
                course_name: course_id.course_name,
                tasks: nonEmptyTasks
            };
        }));

        const filteredCourses = coursesWithTasks.filter(course => course !== null);

        return res.status(200).json({
            success: true,
            data: filteredCourses
        });
    }
}

module.exports = new materialController();
