const Router = require('express');
const router = new Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const fileController = require('../Controllers/fileController');
const authMiddleware = require("../middlewares/authMiddleware");

const pathToStudentStorage = path.resolve(__dirname, '../storage/assignments/students');
const pathToTeacherStorage = path.resolve(__dirname, '../storage/assignments/teachers');

if (!fs.existsSync(pathToStudentStorage)) {
    fs.mkdirSync(pathToStudentStorage, { recursive: true });
}
if (!fs.existsSync(pathToTeacherStorage)) {
    fs.mkdirSync(pathToTeacherStorage, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            if (!req.user) {
                return cb(new Error("❌ Неавторизований доступ"), null);
            }

            let userStoragePath;
            userID = `/${req.user.id}`
            if (req.user.role === "Student") {
                userStoragePath = pathToStudentStorage 
            } else if (req.user.role === "Teacher") {
                userStoragePath = pathToTeacherStorage;
            } else {
                return cb(new Error("❌ Неправильна роль користувача"), null);
            }
            userStoragePath = userStoragePath + userID;
            if (!fs.existsSync(userStoragePath)) {
                fs.mkdirSync(userStoragePath, { recursive: true });
            }

            cb(null, userStoragePath);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, '_');
        const ext = path.extname(file.originalname);
        const filename = `${timestamp}${ext}`;

        console.log("Saving file:", filename);
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.post('/upload', authMiddleware, upload.single("file"), (req, res, next) => {
    console.log("📤 Отримано запит на завантаження файлу.");
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: "❌ Файл не передано!" });
    }
    
    next();
}, fileController.uploadFile);

router.post('/delete', authMiddleware, fileController.deleteFile);

module.exports = router;
