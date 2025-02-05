const Material = require('../Models/Material');
const AssignedUsers = require('../Models/AssignedUsers');
const mongoose = require('mongoose')

class materialController {
    async addTask(req, res) {
        try {
            const { title, description, type, dueDate, points, course_id, assignedUsers, attachments } = req.body;

            const newMaterial = await Material.create({
                title,
                description,
                type,
                dueDate: type === 'practice' ? dueDate : null,
                points: type === 'practice' ? points : null,
                course_id,
                attachments
            });

            if (type === 'practice' && assignedUsers?.length > 0) {
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


    //return all published materials for one student
    async getCourseMaterialsForStudent(req, res) {
        try {
            let { courseId } = req.params;
            let { userId } = req.query;

            courseId = courseId.trim();
            userId = userId.trim()
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid course ID" });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid user ID" });
            }

            const assignedMaterials = await AssignedUsers.find({ user_id: userId }).select('material_id');
            const materialIds = assignedMaterials.map(a => a.material_id);

            const materials = await Material.find({
                course_id: courseId,
                $or: [{ _id: { $in: materialIds } }, { type: 'lecture' }]
            }).sort({ createdAt: -1 });

            return res.status(200).json({ success: true, data: materials });

        } catch (error) {
            console.error("❌ Error fetching assignments:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching assignments", error });
        }
    }

    //return all published materials for all students. Get access only teacher
    async getAllCourseMaterials(req, res) {
        try {
            let { courseId } = req.params;

            console.log(`Course ID: ${courseId}`);

            courseId = courseId.trim();

            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid course ID" });
            }

            const assignments = await Material.find({ course_id: courseId });

            return res.status(200).json({ success: true, data: assignments });

        } catch (error) {
            console.error("❌ Error fetching all assignments:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching all assignments", error });
        }
    }

    //return info about task materials for all students. Get access only teacher
    async getTaskInfoForStudent(req, res) {
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
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }

            const userAssignment = await AssignedUsers.findOne({ material_id: materialId, user_id: userId })
                .select("grade userFile status response")
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

    //return for stundent his tasks result 
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
    
}

module.exports = new materialController();
