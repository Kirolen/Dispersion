import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursePeople } from '../../api/courseService';
import { useNavigate } from 'react-router-dom';
import { deleteMaterial, getAllCourseMaterials, getCourseMaterialsForStudent } from '../../api/materialService'
import { useSelector } from 'react-redux';
import { AiOutlineMore } from "react-icons/ai";


import styles from "./Classwork.module.css"
import AssignmentCreationForm from './AssignmentCreationForm/AssignmentCreationForm';

const Classwork = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [materialType, setMaterialType] = useState("")
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [publishedAssignments, setPublishedAssignments] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const { user_id, role } = useSelector((state) => state.user);
  
    const toggleMenu = (id) => {
        setOpenMenuId(prev => (prev === id ? null : id));
    };

    const openAssignmentCreationForm = (assignmentID, type) => {
        setMaterialType(type);
        setOpenMenuId(assignmentID);
        setShowAssignmentForm(true);
    }

    const removeMaterial = async (assignmentID) => {
        const response = await deleteMaterial(assignmentID)
        if (response.success) {
            setPublishedAssignments(prev => prev.filter(assignment => assignment._id !== assignmentID))
        }
    }

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                let assignments;
                if (role === "Teacher") {
                    assignments = await getAllCourseMaterials(courseId);
                }
                else {
                    assignments = await getCourseMaterialsForStudent(courseId, user_id);
                }
                console.log(assignments)
                setPublishedAssignments(assignments);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    return (
        <div className={styles.classworkContainer}>
            {role === "Teacher" && <>
                <div className={styles.addMassignment}>
                    <button onClick={() => setShowAssignmentForm(true)}>
                        + Add Assignment
                    </button>
                </div>

                {showAssignmentForm && !(materialType.trim().length > 0) && (
                    <div className={styles.chooseMaterialTypeOverlay}>
                        <div className={styles.chooseMaterialTypeContent}>
                            <h2>Select Material Type</h2>
                            <div className={styles.buttonsSection}>
                                <button className={styles.materialButton} onClick={() => openAssignmentCreationForm(null, 'material')}>
                                    Material
                                </button>
                                <button className={styles.materialButton} onClick={() => openAssignmentCreationForm(null, 'practice')}>
                                    Practice
                                </button>
                                <button className={styles.materialButton} onClick={() => openAssignmentCreationForm(null, 'practice_with_test')}>
                                    Practice with test
                                </button>
                            </div>
                        </div>
                    </div>

                )}

                {showAssignmentForm && (materialType.trim().length > 0) && <AssignmentCreationForm materialType={materialType}  
                setMaterialType={setMaterialType}   setShowAssignmentForm={setShowAssignmentForm}
                setPublishedAssignments={setPublishedAssignments} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />}

            </>}

            {<div className={styles.assignmentsList}>
                {publishedAssignments.map((assignment, index) => (
                    <div key={assignment.id || index} className={`${styles.assignmentCard} ${styles[assignment.type]}`}>
                        <h3>{assignment.title}</h3>
                        {assignment.description.trim() && <p>Description: {assignment.description}</p>}


                        {assignment.attachments?.length > 0 && (
                            <div className={styles.assignmentAttachments}>
                                <span className={styles.attachmentIcon}>📎</span>
                                <span>{assignment.attachments.length} attachments</span>
                            </div>
                        )}

                        <div className={styles.assignmentFooter}>
                            <div className={styles.assignmentMeta}>
                                <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "not specified"}</span>
                                <span>Points: {assignment.points ? assignment.points : 'not specified'}</span>
                            </div>
                            <AiOutlineMore className={styles.menuButton} onClick={() => toggleMenu(assignment._id)} />
                            {openMenuId === assignment._id && (
                                <div className={styles.dropdownMenu}>
                                    {role === "Teacher" ? (
                                        <>
                                            <button onClick={() => openAssignmentCreationForm(assignment._id, assignment.type)}>Edit</button>
                                            <button onClick={() => removeMaterial(assignment._id)}>Delete</button>
                                        </>
                                    ) : (
                                        <button onClick={() => navigate(`/assignment/${assignment._id}`)}>View Assignment</button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>}
        </div>
    )
}

export default Classwork