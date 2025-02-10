
const path = require('path'); 
const fs = require('fs');

const AssignedUsers = require('../Models/AssignedUsers');

class fileController {
    async uploadFile(req, res) {
        try {
            const file = req.file;
            const user = req.user
            const role = req.user.role
            const folder = role === "Student" ? "students" : "teachers"
            const filePath = {
                filename: file.originalname,
                url: `/storage/assignments/${folder}/${user.id}/${file.filename}`,
                type: file.mimetype,
            };

            return res.status(200).json({
                success: true,
                message: "✅ Файл успішно загружено!",
                data: filePath,
            });
        } catch (error) {
            console.error("❌ Помилка при загрузці файла:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }

    async deleteFile(req, res) {
        try {
            const {url } = req.body;
            if (!url.includes(`${req.user.id}`)) {
                return res.status(404).json({ success: false, message: "❌ Ви на маєте права видаляти чужий файл" });
            }

            const filePath = path.join(__dirname, "..", url);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: "❌ Файл не знайдено" });
            }

            fs.unlinkSync(filePath);

            return res.status(200).json({ success: true, message: "✅ Файл успішно видалено!" });
        } catch (error) {
            console.error("❌ Помилка при видаленні файлу:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }
}

module.exports = new fileController();
