const Router = require('express');
const router = new Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const fileController = require('../Controllers/fileController');
const authMiddleware = require("../middlewares/authMiddleware");

const storageBasePath = path.resolve(__dirname, '../storage');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!req.user) return cb(new Error("❌ Неавторизований доступ"), null);

        const folder = req.body.folder; 
        console.log("None body: " + req.folder)
        console.log("With body: " + req.body.folder)
        if (!["assignments", "chats"].includes(folder)) {
            return cb(new Error("❌ Неправильна категорія файлів"), null);
        }

        const userPath = path.join(storageBasePath, folder, req.user.id.toString());
        fs.mkdirSync(userPath, { recursive: true });

        cb(null, userPath);
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.array("files", 10), fileController.uploadFiles);
router.post('/delete', authMiddleware, fileController.deleteFile);

module.exports = router;
