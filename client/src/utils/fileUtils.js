import { FaFilePdf, FaFileWord, FaFileImage, FaFilePowerpoint, FaFileExcel, FaFileAlt } from 'react-icons/fa';

export const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();

    const iconStyle = { fontSize: "20px" };

    return (
        <i style={iconStyle}>
            {extension === 'pdf' && <FaFilePdf />}
            {['doc', 'docx'].includes(extension) && <FaFileWord />}
            {['jpg', 'jpeg', 'png', 'gif'].includes(extension) && <FaFileImage />}
            {['ppt', 'pptx'].includes(extension) && <FaFilePowerpoint />}
            {['xls', 'xlsx'].includes(extension) && <FaFileExcel />}
            {extension === 'accdb' && <FaFileAlt />}
            {!['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'ppt', 'pptx', 'xls', 'xlsx', 'accdb'].includes(extension) && <FaFileAlt />}
        </i>
    );
};
