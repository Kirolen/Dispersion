const Material = require('../Models/Material');
const AssignedUsers = require('../Models/AssignedUsers');
const mongoose = require('mongoose')

class materialController {
    async sendMaterial(req, res) {
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

    async getMaterial(req, res) {
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

    async getMaterialInfo(req, res) {
        try {
            let { materialID } = req.params;
            let { userId } = req.query;
            userId = userId.trim()
            console.log(`Material ID: ${materialID}, User ID: ${userId}`);

            if (!mongoose.Types.ObjectId.isValid(materialID)) {
                return res.status(400).json({ success: false, message: "❌ Invalid material ID" });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ success: false, message: "❌ Invalid user ID" });
            }

            // Отримуємо матеріал
            const material = await Material.findById(materialID).lean();
            if (!material) {
                return res.status(404).json({ success: false, message: "❌ Material not found" });
            }

            // Отримуємо деталі про користувача, якщо він призначений на це завдання
            const userAssignment = await AssignedUsers.findOne({ material_id: materialID, user_id: userId })
                .select("grade userFile status response")
                .lean();

            return res.status(200).json({
                success: true,
                data: {
                    ...material,
                    userDetails: userAssignment || null // Повертаємо null, якщо юзер не має доступу
                }
            });

        } catch (error) {
            console.error("❌ Error fetching material info:", error);
            return res.status(500).json({ success: false, message: "❌ Error fetching material info", error });
        }
    }

}

module.exports = new materialController();
