export interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  relationshipStatus: string;
  interests: string[];
  photos: string[];
  verified: boolean;
  lookingFor: ('Long term' | 'Short term' | 'Friendship')[];
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    age: 20,
    gender: 'female',
    college: 'Stanford University',
    department: 'Computer Science',
    year: '3rd',
    bio: 'Love coding, hiking, and good coffee. Always up for exploring new places around campus!',
    relationshipStatus: 'Single',
    interests: ['Programming', 'Hiking', 'Coffee', 'Travel', 'Photography'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&q=85'
    ],
    verified: true,
    lookingFor: ['Long term', 'Friendship']
  },
  {
    id: 2,
    name: 'Michael Chen',
    age: 22,
    gender: 'male',
    college: 'UC Berkeley',
    department: 'Engineering',
    year: 'Senior',
    bio: 'Passionate about sustainable technology and rock climbing. Looking for someone to share adventures with!',
    relationshipStatus: 'Single',
    interests: ['Rock Climbing', 'Sustainability', 'Music', 'Cooking', 'Travel'],
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&q=85'
    ],
    verified: true,
    lookingFor: ['Short term', 'Friendship']
  },
  {
    id: 3,
    name: 'Sofia Rodriguez',
    age: 21,
    gender: 'female',
    college: 'USC',
    department: 'Business',
    year: 'Junior',
    bio: 'Future entrepreneur with a love for art and good food. Let\'s grab brunch and talk about our dreams!',
    relationshipStatus: 'Single',
    interests: ['Art', 'Entrepreneurship', 'Food', 'Yoga', 'Fashion'],
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&q=85'
    ],
    verified: false,
    lookingFor: ['Long term', 'Friendship']
  },
  {
    id: 4,
    name: 'David Kim',
    age: 23,
    gender: 'male',
    college: 'UCLA',
    department: 'Arts',
    year: 'Graduate',
    bio: 'Film student and coffee enthusiast. Always looking for the perfect shot and the perfect espresso.',
    relationshipStatus: 'Single',
    interests: ['Film', 'Photography', 'Coffee', 'Books', 'Travel'],
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=600&h=800&fit=crop&q=85'
    ],
    verified: true,
    lookingFor: ['Long term']
  },
  {
    id: 5,
    name: 'Ashley Thompson',
    age: 19,
    gender: 'female',
    college: 'Stanford University',
    department: 'Medicine',
    year: 'Freshman',
    bio: 'Pre-med student with a passion for helping others. Love dancing, reading, and late-night study sessions.',
    relationshipStatus: 'Single',
    interests: ['Dancing', 'Medicine', 'Reading', 'Volunteering', 'Fitness'],
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop&q=85'
    ],
    verified: false,
    lookingFor: ['Long term', 'Friendship']
  },
  {
    id: 6,
    name: 'James Park',
    age: 24,
    gender: 'male',
    college: 'MIT',
    department: 'Computer Science',
    year: 'Graduate',
    bio: 'AI researcher by day, musician by night. Looking for deep conversations and spontaneous adventures.',
    relationshipStatus: 'Single',
    interests: ['AI', 'Music', 'Gaming', 'Cooking', 'Philosophy'],
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=800&fit=crop&q=85'
    ],
    verified: true,
    lookingFor: ['Long term', 'Friendship']
  },
  {
    id: 7,
    name: 'Olivia Martinez',
    age: 22,
    gender: 'female',
    college: 'Harvard',
    department: 'Psychology',
    year: 'Senior',
    bio: 'Psychology major who loves understanding people. Yoga instructor, book lover, and tea enthusiast.',
    relationshipStatus: 'Single',
    interests: ['Psychology', 'Yoga', 'Reading', 'Tea', 'Meditation'],
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop&q=85'
    ],
    verified: true,
    lookingFor: ['Long term']
  },
  {
    id: 8,
    name: 'Ryan Cooper',
    age: 21,
    gender: 'male',
    college: 'UC San Diego',
    department: 'Biology',
    year: 'Junior',
    bio: 'Marine biology enthusiast who spends weekends surfing and diving. Love the ocean and protecting it!',
    relationshipStatus: 'Single',
    interests: ['Surfing', 'Marine Biology', 'Diving', 'Photography', 'Conservation'],
    photos: [
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=600&h=800&fit=crop&q=85',
      'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=600&h=800&fit=crop&q=85'
    ],
    verified: false,
    lookingFor: ['Short term', 'Friendship']
  }
];