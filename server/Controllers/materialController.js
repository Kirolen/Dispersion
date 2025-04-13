const Material = require('../Models/Material');
const AssignedUsers = require('../Models/AssignedUsers');
const User = require("../Models/User");
const CourseOwner = require("../Models/CourseOwner")
const mongoose = require('mongoose');
const CourseAccess = require('../Models/CourseAccess');


class materialController {
    async addTask(req, res) {
        try {
            const { title, description, type, dueDate, points, course_id, assignedUsers, attachments, availableFrom, isAvailableToAll } = req.body;

            const newMaterial = await Material.create({
                title,
                description,
                type,
                dueDate,
                points,
                course_id,
                attachments,
                availableFrom,
                isAvailableToAll
            });

            if (type !== 'material') {
                for (const userId of assignedUsers) {
                    const existingAssignment = await AssignedUsers.findOne({ user_id: userId, material_id: newMaterial._id });

                    if (!existingAssignment) {
                        await AssignedUsers.create({ user_id: userId, material_id: newMaterial._id });
                    }
                }
            }

            return res.status(201).json({ success: true, message: "✅ Material added successfully", data: newMaterial });

        } catch (error) {
            console.error("❌ Error adding material:", error);
            return res.status(500).json({ success: false, message: "❌ Error adding material", error });
        }
    }

    async deleteAssignment(req, res) {
        try {
            const assignmentID = req.params.assignmentId;

            const material = await Material.findById(assignmentID);
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }
    
            if (material.type !== 'material') await AssignedUsers.deleteMany({ material_id: assignmentID });
    
            await Material.findByIdAndDelete(assignmentID);

            return res.status(201).json({ success: true, message: "✅ Material delete successfully" });

        } catch (error) {
            console.error("❌ Error delete material:", error);
            return res.status(500).json({ success: false, message: "❌ Error delete material", error });
        }
    }

    async getMaterialInfo(req, res) {
        try {
            const assignmentID = req.params.assignmentId;
            const material = await Material.findById(assignmentID);
            if (!material) return res.status(404).json({ success: false, message: "❌ Material not found", error });

            const assignedUsers = await AssignedUsers.find({material_id: assignmentID})
            const assignedStudents = assignedUsers.map(student => {
                return student.user_id.toString();
            })
            return res.status(200).json({ success: true, data: {...material.toObject(), assignedStudents} })
        } catch (error) {
            return res.status(500).json({ success: false, message: "❌ Error getting material info", error });
        }
    }

    async updateMaterialInfo(req, res) {
        try {
            const { title, description, type, dueDate, points, course_id, assignedUsers, attachments, availableFrom, isAvailableToAll } = req.body;
    
            const assignmentID = req.params.assignmentId;
    
            const material = await Material.findById(assignmentID);
            if (!material) return res.status(404).json({ success: false, message: "❌ Material not found" });
    
            const updatedMaterial = await Material.findByIdAndUpdate(
                assignmentID,
                { title, description, type, dueDate, points, course_id, attachments, availableFrom, isAvailableToAll },
                { new: true }
            );
    
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

            return res.status(200).json({ success: true, message: "✅ Material updated successfully", data: updatedMaterial });
        } catch (error) {
            console.error("❌ Error updating material:", error);
            return res.status(500).json({ success: false, message: "❌ Error updating material", error });
        }
    }
    
    //return all published materials for one student
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

    //return all published materials for all students. Get access only teacher
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

    //return info about task materials for all students. Get access only teacher
    async getStudentTaskInfo(req, res) {
        try {
            let { materialId } = req.params;
            let { userId } = req.query;
            userId = userId.trim()
            console.log(`Material ID: ${materialId}, User ID: ${userId}`);

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

    //return for teacher all task result 
    async getStudentsTaskResult(req, res) {
        try {
            let { materialId } = req.params;

            console.log(`Material ID: ${materialId}`);

            if (!mongoose.Types.ObjectId.isValid(materialId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid material ID" });
            }

            const material = await Material.findById(materialId).lean();
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }

            const assignedUsers = await AssignedUsers.find({ material_id: materialId })
                .populate('user_id', 'first_name last_name')
                .lean();

            if (!assignedUsers.length) {
                return res.status(200).json({ success: true, data: [], message: "⚠️ No students assigned to this task" });
            }

            const taskStatus = assignedUsers.map(student => ({
                student_id: student.user_id._id,
                name: `${student.user_id.first_name} ${student.user_id.last_name}`,
                grade: student.grade || 'Not graded',
                status: student.status || 'Not submitted'
            }));

            return res.status(200).json({
                success: true,
                data: taskStatus
            });

        } catch (error) {
            console.error("❌ Error fetching material info:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching material info", error });
        }
    }

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

    async gradeTask(req, res) {
        try {
            const { material_id, student_id, teacher_id, grade, message } = req.body;
            const material = await Material.findById(material_id);
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Завдання не знайдено" });
            }

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

    async getFilteredAssignmentsByTeacher(req, res) {
        try {
            const { userId } = req.params;
            const { filterValue } = req.query;

            const teacher = await User.findById(userId);
            if (!teacher) return res.status(404).json({ success: false, message: "❌ Teacher not found" });

            const courseOwners = await CourseOwner.find({ teacher_id: userId }).populate("course_id", "course_name course_desc");

            const coursesWithTasks = await Promise.all(courseOwners.map(async ({ course_id }) => {
                const assignments = await Material.find({ course_id: course_id._id, type: "practice" }).select("title").lean();

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


    async getFilteredAssignmentsByStudent(req, res) {
        const { userId } = req.params;
        let { filterValue } = req.query;

        if (filterValue === "all") filterValue = "";

        console.log("User ID:", userId);

        const student = await User.findById(userId);
        if (!student) {
            return res.status(404).json({ success: false, message: "❌ Student not found" });
        }

        const enrolledCourses = await CourseAccess.find({ student_id: userId })
            .populate("course_id", "course_name course_desc");

        const coursesWithTasks = await Promise.all(enrolledCourses.map(async ({ course_id }) => {
            const practiceAssignments = await Material.find({
                course_id: course_id._id,
                type: "practice"
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
