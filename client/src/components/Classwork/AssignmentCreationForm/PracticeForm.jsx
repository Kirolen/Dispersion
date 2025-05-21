import React from 'react';
import styles from "./AssignmentCreationForm.module.css";

const PracticeForm = ({ assignmentForm, updateAssignmentFormField, handleChange, filteredStudents, handleCheckboxChange }) => {
    return (
        <>
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
                    onChange={(e) => updateAssignmentFormField('searchQuery', e.target.value)}
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
        </>
    );
};

export default PracticeForm;