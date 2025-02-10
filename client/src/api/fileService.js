import api from './api';
export const uploadFile = async (files) => {
    try {
        const formData = new FormData();
        
        files.forEach((file) => {
            formData.append("file", file);  
        });

        console.log("Try add file")
        const response = await api.post("/file/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.data;
    } catch (error) {
        console.error("❌ ПОМИЛКА при завантаженні файлу:", error.response?.data || error.message);
        throw new Error("Error upload file: " + error.message);
    }
};
export const deleteFile = async (material_id, url) => {
    try {
        console.log(url)
        const response = await api.post("/file/delete", {material_id, url});

        return response.data.data;
    } catch (error) {
        console.error("❌ ПОМИЛКА при видалені файлу:", error.response?.data || error.message);
        throw new Error("Error upload file: " + error.message);
    }
};


