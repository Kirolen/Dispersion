import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from "./AssignmentCreationForm.module.css";
import { GoPaperclip } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import { getFileIcon } from '../../../utils/fileUtils';
import { getCoursePeople } from '../../../api/courseService';
import { addTask, getMaterialInfo, updateMaterialInfo } from '../../../api/materialService';
import { deleteFile, uploadFiles } from '../../../api/fileService';

const AssignmentCreationForm = ({ materialType, setMaterialType, setShowAssignmentForm, setPublishedAssignments, openMenuId, setOpenMenuId }) => {
    const { courseId } = useParams();
    const [assignmentForm, setAssignmentForm] = useState({
        title: '',
        description: '',
        points: '',
        dueDateOption: 'none',
        dueDate: '',
        availableFromOption: 'none',
        availableFrom: '',
        assignToAll: true,
        assignedStudents: [],
        searchQuery: '',
        attachments: [],
    });

    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCoursePeople(courseId);
            if (openMenuId) {
                const materialData = await getMaterialInfo(openMenuId)

                if (materialData.success) {
                    console.log("MaterialData")
                    console.log(materialData.data)
                    setAssignmentForm(prev => ({
                        ...prev,
                        title: materialData.data.title.trim() || '',
                        description: materialData.data.description.trim() || '',
                        points: materialData.data.points || '',
                        dueDateOption: materialData.data.dueDate ? 'set' : 'none',
                        dueDate: materialData.data.dueDate ? materialData.dueDate : '',
                        availableFromOption: materialData.data.availableFrom ? 'set' : 'none',
                        availableFrom: materialData.data.availableFrom ? materialData.availableFrom : '',
                        assignToAll: materialData.data.isAvailableToAll,
                        attachments: materialData.data.attachments || [],
                        assignedStudents: materialData.data.assignedStudents || []
                    }))
                }
            }
            else {

                setAssignmentForm(prev => ({
                    ...prev,
                    assignedStudents: data.students.map(student => student.id)
                }));
                setFilteredStudents(data.students)
            }
            setStudents(data.students)
        }

        fetchData();
    }, [courseId, openMenuId])

    useEffect(() => {
        if (students.length === 0) return;
        const filteredStudents = students.filter(student =>
            student.name.toLowerCase().includes(assignmentForm.searchQuery.toLowerCase())
        );
        setFilteredStudents(filteredStudents)
    }, [assignmentForm.searchQuery, students])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignmentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (value === 'all') {
            setAssignmentForm(prev => ({
                ...prev,
                assignedStudents: checked ? students.map(student => student.id) : [],
                assignToAll: checked
            }));
        } else {
            setAssignmentForm(prev => ({
                ...prev,
                assignedStudents: checked
                    ? [...prev.assignedStudents, value]
                    : prev.assignedStudents.filter(id => id !== value),
                assignToAll: false
            }));
        }
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setAssignmentForm(prev => ({ ...prev, searchQuery: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAssignmentForm(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files],
        }));
        console.log(files)
    };

    const handleFileRemove = async (index) => {

        const fileToRemove = assignmentForm.attachments[index];
        console.log("File to remove:", fileToRemove.url);
    
        if (openMenuId && fileToRemove && !(fileToRemove instanceof File)) {
            await deleteFile(fileToRemove.url); 
        }

        setAssignmentForm(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));

    };

    const handleSubmit = async () => {
        const attachmentsToUpload = assignmentForm.attachments.filter(file => file instanceof File)
        const uploadedAttachments = assignmentForm.attachments.filter(file => !(file instanceof File))
        let uploadedFiles = [];
        if (attachmentsToUpload.length > 0) uploadedFiles = await uploadFiles(attachmentsToUpload, 'assignments')
        const attachments = [...uploadedAttachments, ...uploadedFiles];

        const formData = {
            title: assignmentForm.title,
            description: assignmentForm.description,
            type: materialType,
            dueDate: assignmentForm.dueDate,
            points: assignmentForm.points,
            course_id: courseId,
            assignedUsers: assignmentForm.assignedStudents,
            attachments: attachments || [],
            availableFrom: assignmentForm.availableFrom,
            isAvailableToAll: students.length === assignmentForm.assignedStudents.length
        }
        if (openMenuId) {
            const data = await updateMaterialInfo(openMenuId, formData)

            console.log(data.data)
            setPublishedAssignments(prev => prev.map(assignment =>
                assignment._id === data.data._id ? data.data : assignment
            ))
            setShowAssignmentForm(false)
            setMaterialType('');
            setOpenMenuId('')
        }
        else {
            const material = await addTask(formData)
            if (material.success) {
                console.log(material.data)
                setPublishedAssignments(prev => [material.data, ...prev])
                setShowAssignmentForm(false)
                setMaterialType('');
            }
        }
    }

    const handleCancel = () => {
        setAssignmentForm({
            title: '',
            description: '',
            points: '',
            dueDateOption: 'none',
            dueDate: '',
            availableFromOption: 'none',
            availableFrom: '',
            assignToAll: true,
            assignedStudents: [],
            searchQuery: '',
            attachments: [],
        })
        setShowAssignmentForm(false)
        setMaterialType('');
    }

    return (
        <div className={styles.assignmentFormOverlay}>
            <div className={styles.assignmentFormSection}>
                <h2>Create Assignment</h2>
                <form className={styles.assignmentForm}>
                    <div className={styles.assignmentFormContent}>
                        <div className={styles.left}>
                            <input
                                type="text"
                                name="title"
                                className={styles.textInput}
                                placeholder="Title (required)"
                                value={assignmentForm.title}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={assignmentForm.description}
                                onChange={handleChange}
                            />
                            <div className={styles.fileUploadGroup}>
                                <label className={styles.fileInputLabel}>
                                    <p>Choose file</p>
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        className={styles.fileInput}
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    <GoPaperclip className={styles.paperclipIcon} />
                                </label>

                                {assignmentForm.attachments.length > 0 && (
                                    <div className={styles.fileList}>
                                        {assignmentForm.attachments.map((file, index) => (
                                            <div key={index} className={styles.fileItem}>
                                                {getFileIcon(file.filename || file.name)}
                                                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename || file.name}</a>
                                                <AiFillDelete
                                                    className={styles.removeFileButton}
                                                    onClick={() => handleFileRemove(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {materialType !== "material" && (
                            <div className={styles.right}>
                                <input
                                    type="text"
                                    name="points"
                                    className={styles.textInput}
                                    placeholder="Points"
                                    value={assignmentForm.points}
                                    onChange={handleChange}
                                />

                                <div className={styles.dateGroup}>
                                    <label className={styles.dueDateLabel}>Due Date</label>
                                    <select
                                        name="dueDateOption"
                                        value={assignmentForm.dueDateOption}
                                        onChange={handleChange}
                                    >
                                        <option value="none">No deadline</option>
                                        <option value="set">Set deadline</option>
                                    </select>
                                    {assignmentForm.dueDateOption === "set" && (
                                        <input
                                            type="datetime-local"
                                            name="dueDate"
                                            value={assignmentForm.dueDate}
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>

                                <div className={styles.dateGroup}>
                                    <label className={styles.availableLabel}>Available From</label>
                                    <select
                                        name="availableFromOption"
                                        value={assignmentForm.availableFromOption}
                                        onChange={handleChange}
                                    >
                                        <option value="none">Immediately</option>
                                        <option value="set">Schedule</option>
                                    </select>
                                    {assignmentForm.availableFromOption === "set" && (
                                        <input
                                            type="datetime-local"
                                            name="availableFrom"
                                            value={assignmentForm.availableFrom}
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>

                                <label>Assign to Users</label>
                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value="all"
                                            checked={assignmentForm.assignToAll}
                                            onChange={handleCheckboxChange}
                                        />
                                        Assign to all
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={assignmentForm.searchQuery}
                                        onChange={handleSearchChange}
                                        className={styles.searchInput}
                                    />

                                    {filteredStudents.map(student => (
                                        <label key={student.id}>
                                            <input
                                                type="checkbox"
                                                value={student.id}
                                                checked={assignmentForm.assignedStudents.includes(student.id)}
                                                disabled={assignmentForm.assignToAll}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span>{student.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" className={styles.submitButton} onClick={handleSubmit}>Submit</button>
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentCreationForm;
