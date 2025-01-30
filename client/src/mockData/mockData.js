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

export const mockAssignments = [
  {
    id: '1',
    title: 'React Components Research',
    description: 'Research and write about React component lifecycle methods',
    dueDate: '2024-02-15',
    points: 100,
    status: 'pending',
    submissions: [
      {
        student_id: '2',
        submitted_at: '2024-02-14',
        file_url: 'path/to/submission.pdf',
        grade: 85,
        feedback: 'Good work, but needs more examples'
      }
    ]
  },
  {
    id: '2',
    title: 'State Management Project',
    description: 'Create a small project demonstrating Redux usage',
    dueDate: '2024-02-20',
    points: 150,
    status: 'active',
    submissions: []
  }
];

export const mockTests = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics',
    timeLimit: 30,
    questions: [
      {
        id: '1',
        type: 'single',
        question: 'What is JSX?',
        options: [
          'JavaScript XML',
          'Java Syntax Extension',
          'JavaScript Extension',
          'Java XML'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        type: 'multiple',
        question: 'Which hooks are part of React?',
        options: [
          'useState',
          'useEffect',
          'useContext',
          'useHistory'
        ],
        correctAnswers: [0, 1, 2]
      }
    ]
  }
];

export const mockMessages = [
  {
    id: '1',
    sender_id: '1',
    receiver_id: '2',
    content: 'How is your progress on the React assignment?',
    timestamp: '2024-02-10T10:30:00Z',
    read: true
  },
  {
    id: '2',
    sender_id: '2',
    receiver_id: '1',
    content: 'I\'m working on it, will submit soon!',
    timestamp: '2024-02-10T10:35:00Z',
    read: false
  }
];

export const mockCalendarEvents = [
  {
    id: '1',
    title: 'React Components Assignment Due',
    start: '2024-02-15T23:59:00Z',
    end: '2024-02-15T23:59:00Z',
    type: 'assignment'
  },
  {
    id: '2',
    title: 'React Fundamentals Test',
    start: '2024-02-20T14:00:00Z',
    end: '2024-02-20T15:30:00Z',
    type: 'test'
  },
  {
    id: '3',
    title: 'Course Introduction Meeting',
    start: '2024-02-12T10:00:00Z',
    end: '2024-02-12T11:00:00Z',
    type: 'meeting'
  }
];

export const mockCourses = () => { 
  return [
    {
      course_id: '1',
      course_name: 'Introduction to React',
      course_desc: 'Learn the basics of React development',
      teacher_id: '1',
      teacher: {
        name:'John Doe',
        email: 'john@example.com',
      },
      students: [mockUsers[1]],
      created_at: '2023-01-01',
      announcements: [
        {
          id: '1',
          author: 'John Doe',
          message: 'Welcome to the React course!',
          created_at: '2023-01-01'
        }
      ],
      assignments: mockAssignments,
      tests: mockTests,
      calendar_events: mockCalendarEvents,
      messages: mockMessages
    }
  ];
};