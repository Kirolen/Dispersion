import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const CoursePage = () => {
  const { courseId } = useParams(); // Отримуємо ID курсу з URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`); // Звертаємося до бекенду для отримання деталей курсу
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <p>Loading course details...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold">{course.course_name}</h1>
        <p className="text-gray-700 mt-4">Teacher ID: {course.teacher_id}</p>
        <h2 className="text-xl font-semibold mt-6">Materials:</h2>
        <ul className="mt-4">
          {course.material_ids && course.material_ids.length > 0 ? (
            course.material_ids.map((material, index) => (
              <li
                key={index}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {material}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No materials available for this course.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CoursePage;
