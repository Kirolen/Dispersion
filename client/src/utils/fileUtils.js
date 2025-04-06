
import { FaFilePdf, FaFileWord, FaFileImage, FaFilePowerpoint, FaFileExcel, FaFileAlt } from 'react-icons/fa';

export const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    switch (extension) {
        case 'pdf':
            return <FaFilePdf />;
        case 'doc':
        case 'docx':
            return <FaFileWord />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return <FaFileImage />;
        case 'ppt':
        case 'pptx':
            return <FaFilePowerpoint />;
        case 'xls':
        case 'xlsx':
            return <FaFileExcel />;
        case 'accdb':
            return <FaFileAlt />;
        default:
            return <FaFileAlt />;
    }
};