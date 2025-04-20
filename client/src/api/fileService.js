import api from './api';
export const uploadFiles = async (files, folder) => {
    try {
        const formData = new FormData();
        formData.append("folder", folder);
        if (!Array.isArray(files)) {
            formData.append("files", files);
        } else {
            files.forEach((file) => {
                formData.append("files", file);
            });
        }
        const response = await api.post("/file/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data;
    } catch (error) {
        console.error("❌ ПОМИЛКА при завантаженні файлу:", error.response?.data || error.message);
        throw new Error("Error upload file: " + error.message);
    }
};
export const deleteFile = async (url) => {
    try {
        console.log("delete")

        const response = await api.post("/file/delete", { url });

        return response.data.data;
    } catch (error) {
        console.error("❌ ПОМИЛКА при видалені файлу:", error.response?.data || error.message);
        throw new Error("Error upload file: " + error.message);
    }
};


