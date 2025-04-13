
const path = require('path'); 
const fs = require('fs');

class fileController {
    async uploadFiles(req, res) {
        try {
            const files = req.files;
            const user = req.user
            const folder = req.body.folder

            if (!files || files.length === 0) {
                return res.status(400).json({ success: false, message: "❌ Файли не передано" });
            }

            const filePaths = files.map(file => ({
                filename: file.originalname,
                url: `http://localhost:5000/storage/${folder}/${user.id}/${file.filename}`,
                type: file.mimetype,
            }));
    
            return res.status(200).json({
                success: true,
                message: "✅ Файли успішно загружено!",
                data: filePaths,
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

            const filePath = path.join(__dirname, "..", url).replace('\http:\\localhost:5000', '');
            console.log(filePath)
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
