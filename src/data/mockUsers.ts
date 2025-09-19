export interface User {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  college: string;
  department: string;
  year: string;
  bio: string;
  relationshipStatus: string;
  interests: string[];
  photos: string[];
  verified: boolean;
  distance: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    age: 20,
    gender: 'female',
    college: 'Stanford University',
    department: 'Computer Science',
    year: 'Sophomore',
    bio: 'Love coding, hiking, and good coffee. Always up for exploring new places around campus!',
    relationshipStatus: 'Single',
    interests: ['Programming', 'Hiking', 'Coffee', 'Travel', 'Photography'],
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    verified: true,
    distance: '2 miles'
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
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    verified: true,
    distance: '5 miles'
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
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1845457/pexels-photo-1845457.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    verified: false,
    distance: '3 miles'
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
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    verified: true,
    distance: '7 miles'
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
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    verified: false,
    distance: '1 mile'
  }
];