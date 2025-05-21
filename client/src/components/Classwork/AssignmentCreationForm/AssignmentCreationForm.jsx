import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./AssignmentCreationForm.module.css";
import { GoPaperclip } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import { getFileIcon } from '../../../utils/fileUtils';
import { getCoursePeople } from '../../../api/courseService';
import { addTask, getMaterialInfo, updateMaterialInfo } from '../../../api/materialService';
import { deleteFile, uploadFiles } from '../../../api/fileService';
import { getTests } from '../../../api/testService';
import MaterialForm from './MaterialForm';
import PracticeForm from './PracticeForm';
import TestForm from './TestForm';

const initialAssignmentForm = {
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
    test: null
};

const initialTestProperties = {
        isRandomQuestions: false,
        questionCountByType: {
            single: 0,
            multiple: 0,
            short: 0,
            long: 0,
        },
        timeLimit: 0,
        startDate: '',
        endDate: ''
    }

const AssignmentCreationForm = ({ materialType, setMaterialType, setShowAssignmentForm, setPublishedAssignments, openMenuId, setOpenMenuId }) => {
    const { courseId } = useParams();
    const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);
    const [testProperties, setTestProperties] = useState(initialTestProperties)
    const [testsArray, setTestArray] = useState([])
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([])
    const [imageForRemoving, setImageForRemoving] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCoursePeople(courseId);
            const tests = await getTests();
            if (openMenuId) {
                const materialData = await getMaterialInfo(openMenuId)
                if (materialData.success) {
                    setAssignmentForm(materialData.reformedMaterial)
                    setTestProperties(materialData.testProperties)
                    console.log(materialData.testProperties)
                }
            }
            else {
                updateAssignmentFormField('assignedStudents', data.students.map(student => student.id))
                setFilteredStudents(data.students)
            }
            setStudents(data.students)
            setTestArray(tests)
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

    const updateAssignmentFormField = (key, value) => {
        setAssignmentForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignmentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (value === 'all') updateAssignmentFormField('assignedStudents', checked ? students.map(student => student.id) : [])
        else {
            updateAssignmentFormField('assignedStudents', checked
                ? [...assignmentForm.assignedStudents, value]
                : assignmentForm.assignedStudents.filter(id => id !== value))
        }
        updateAssignmentFormField(value === "all" ? checked : false)
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setAssignmentForm(prev => ({ ...prev, searchQuery: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        updateAssignmentFormField("attachments", [...assignmentForm.attachments, ...files])
    };

    const handleFileRemove = (index) => {
        const fileToRemove = assignmentForm.attachments[index];

        if (!(fileToRemove instanceof File) && fileToRemove.url) {
            setImageForRemoving(prev => ([...prev, fileToRemove.url]))
        }
        updateAssignmentFormField("attachments", assignmentForm.attachments.filter((_, i) => i !== index))
    };

    const handleSubmit = async () => {
        if (imageForRemoving.length > 0) {
            imageForRemoving.forEach(async (i) => await deleteFile(i))
        }

        const attachments = await Promise.all(assignmentForm.attachments.map(async (file) => {
            if (file instanceof File) return (await uploadFiles(file, 'assignments'))[0]
            else if (file.url) return file;
            return undefined;
        }));


        const formData = { ...assignmentForm };
        formData.type = materialType;
        formData.course_id = courseId
        formData.attachments = attachments.filter(file => file !== undefined);
        formData.testProperties = testProperties
        console.log(testProperties)
        if (openMenuId) {
            const data = await updateMaterialInfo(openMenuId, formData)
            setPublishedAssignments(prev => prev.map(assignment =>
                assignment._id === data.data._id ? data.data : assignment
            ))
        }
        else {
            const material = await addTask(formData)
            if (material.success) setPublishedAssignments(prev => [material.data, ...prev])
        }
        setShowAssignmentForm(false)
        setMaterialType('');
        setOpenMenuId('')
    }

    const handleCancel = () => {
        setAssignmentForm(initialAssignmentForm)
        setShowAssignmentForm(false)
        setMaterialType('');
        setOpenMenuId('')
    }

    const handleTestChange = (e) => {
        const selectedTestId = e.target.value;
        console.log(assignmentForm.test)
        console.log(e.target.value)
        
  updateAssignmentFormField("test", e.target.value)
        const selectedTest = testsArray.find(test => test.id === selectedTestId);

        updateAssignmentFormField("test", selectedTestId);
        setTestProperties({
            ...initialTestProperties,
            isRandomQuestions: true
        })
    };

    return (
        <div className={styles.assignmentFormOverlay}>
            <div className={styles.assignmentFormSection}>
                <h2>Create Assignment</h2>
                <form className={styles.assignmentForm}>
                    <div className={styles.assignmentFormContent}>
                        <div className={styles.left}>
                            <MaterialForm
                                setImageForRemoving={setImageForRemoving}
                                assignmentForm={assignmentForm}
                                updateAssignmentFormField={updateAssignmentFormField} />

                        </div>

                            {materialType === "practice_with_test" && <div className={`${styles.center}`}>
                                <TestForm
                                       assignmentForm={assignmentForm}
                                        testProperties={testProperties}
                                        setTestProperties={setTestProperties}
                                        testsArray={testsArray} 
                                        handleTestChange={handleTestChange}
                                />
                            </div>}
                        {materialType !== "material" && <div className={styles.right}>
                            <PracticeForm
                                assignmentForm={assignmentForm}
                                updateAssignmentFormField={updateAssignmentFormField}
                                handleChange={handleChange}
                                filteredStudents={filteredStudents}
                                handleCheckboxChange={handleCheckboxChange} />
                        </div>}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.submitButton} onClick={handleSubmit}>Submit</button>
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                    </div>
                </form>


                {materialType === "smaterial" && <form className={styles.assignmentForm}>
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
                            {materialType === "practice_with_test"
                                && <>
                                    <select onChange={handleTestChange}>
                                        <option value="">Вибрати тест</option>
                                        {testsArray.map((option, index) => (
                                            <option key={option.id} value={option.id}>
                                                {option.title}
                                            </option>
                                        ))}
                                    </select>
                                    <label className={styles.dueDateLabel}>Start Date</label>
                                    <select
                                        name="dueDateOption"
                                        value={assignmentForm.dueDateOption}
                                        onChange={handleChange}
                                    >
                                        <option value="none">No start date</option>
                                        <option value="set">Set start date</option>
                                    </select>
                                    {assignmentForm.dueDateOption === "set" && (
                                        <input
                                            type="datetime-local"
                                            name="dueDate"
                                            value={assignmentForm.dueDate}
                                            onChange={handleChange}
                                        />
                                    )}
                                </>
                            }
                            {materialType !== "material" && <div className={styles.dateGroup}>
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
                            </div>}
                            {materialType === "practice_with_test" && <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={testProperties.isRandomQuestions}
                                        onChange={(e) => setTestProperties({ ...testProperties, isRandomQuestions: e.target.checked })}
                                    />
                                    Enable Random Questions Selection
                                </label>
                            </div>}

                            {testProperties.isRandomQuestions && assignmentForm.test && (
                                <div className={styles.randomQuestionsSection}>
                                    <h4>Number of Questions by Type</h4>
                                    <div className={styles.questionTypeGrid}>
                                        {Object.entries(testProperties.questionCountByType).map(([type, count]) => (
                                            <div key={type} className={styles.questionTypeInput}>
                                                <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={assignmentForm.test.questionTypeCount[type]}
                                                    value={count === 0 ? '' : count}
                                                    placeholder={`max ${assignmentForm.test.questionTypeCount[type]} questions`}
                                                    onChange={(e) =>
                                                        setTestProperties({
                                                            ...testProperties,
                                                            questionCountByType: {
                                                                ...testProperties.questionCountByType,
                                                                [type]: parseInt(e.target.value || '0'),
                                                            }
                                                        })
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                </form>}

            </div>
        </div>
    );
};

export default AssignmentCreationForm;
