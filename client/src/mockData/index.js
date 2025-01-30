export const mockUsers = [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'Teacher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      created_at: '2023-01-01'
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      role: 'Student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      created_at: '2023-01-02'
    }
  ];
  
  export const mockCourses = [
    {
      _id: '1',
      course_name: 'Introduction to React',
      description: 'Learn the basics of React development',
      teacher_id: '1',
      teacher_name: 'John Doe',
      teacher_email: 'john@example.com',
      students: [mockUsers[1]],
      created_at: '2023-01-01',
      announcements: [
        {
          id: '1',
          author: 'John Doe',
          content: 'Welcome to the React course!',
          date: '2023-01-01'
        }
      ],
      assignments: [
        {
          id: '1',
          title: 'Build a Todo App',
          description: 'Create a simple todo application using React',
          dueDate: '2023-12-31'
        }
      ],
      tests: [
        {
          id: '1',
          title: 'React Basics Quiz',
          description: 'Test your knowledge of React fundamentals',
          questions: [
            {
              id: '1',
              question: 'What is JSX?',
              options: [
                'JavaScript XML',
                'Java Syntax Extension',
                'JavaScript Extension',
                'Java XML'
              ],
              correctAnswer: 0
            }
          ],
          timeLimit: 30,
          totalPoints: 100
        }
      ]
    }
  ];
  
  export const mockGrades = [
    {
      student_id: '2',
      course_id: '1',
      assignment_id: '1',
      score: 85,
      feedback: 'Good work!',
      submitted_at: '2023-12-15'
    }
  ];