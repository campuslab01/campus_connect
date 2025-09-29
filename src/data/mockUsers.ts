interface User {
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
      '/images/catgirluser1.jpg',
      '/images/catgirluser1S.jpg',
      '/images/catgirluser1.jpg'
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
      '/images/Boyuser1.jpg',
      '/images/Boyuser1S.jpg',
      '/images/Boyuser1M.jpg'
      
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
      '/images/girluser2A.jpg',
      '/images/girluser2S.jpg',
      '/images/girluser2M.jpg'
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
      '/images/boyuser2A.jpg',
      '/images/boyuser2S.jpg',
      '/images/boyuser2M.jpg'
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
      '/images/girluser4A.jpg',
      '/images/girluser4S.jpg',
      '/images/girluser4M.jpg'
    ],
    verified: false,
    lookingFor: ['Long term', 'Friendship']
  }
];
