
const path = require('path');
const fs = require('fs');

/**
 * @class fileController
 * @classdesc Handles file upload and retrieval for use in materials, tests, and user submissions.
 *
 * ### Features:
 * - Upload single or multiple files.
 * - Download or delete files as needed.
 * - Integrate file storage into test and material objects.
 *
 * @exports fileController
 */
class fileController {
    /**
    * Handles uploading multiple files sent in the request.
    * 
    * Expects files in `req.files`, authenticated user info in `req.user`,
    * and target folder name in `req.body.folder`.
    * 
    * Generates URLs for uploaded files based on user ID and folder.
    * 
    * Returns JSON response with success message and array of uploaded file info.
    * 
    *  @param {Object} req - Express request object; expects `files`, `user`, and `body.folder`.
    * @param {Object} res - Express response object.
    * @returns {Promise<void>} JSON response with upload status and file data.
    */
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

     /**
     * Deletes a file from the server file system based on the provided URL.
     * 
     * Validates that the file belongs to the authenticated user by checking
     * if the user ID is part of the file URL.
     * 
     * Converts the URL to a local file path, checks if the file exists,
     * and deletes it using `fs.unlinkSync`.
     * 
     * Returns JSON response with success or error message accordingly.
     * 
     * @param {Object} req - Express request object; expects `body.url` and authenticated `user`.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>} JSON response with deletion status.
     */
    async deleteFile(req, res) {
        try {
            const { url } = req.body;
            if (!url.includes(`${req.user.id}`)) {
                return res.status(404).json({ success: false, message: "❌ Ви на маєте права видаляти чужий файл" });
            }

            const filePath = path.join(__dirname, "..", url).replace('\http:\\localhost:5000', '');
            console.log(filePath)
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: "❌ Файл не знайдено" });
            }
            console.log(filePath)
            fs.unlinkSync(filePath);

            return res.status(200).json({ success: true, message: "✅ Файл успішно видалено!" });
        } catch (error) {
            console.error("❌ Помилка при видаленні файлу:", error);
            return res.status(500).json({ success: false, message: "❌ Помилка сервера", error });
        }
    }
}

module.exports = new fileController();
