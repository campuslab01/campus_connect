export interface Like {
  id: number;
  name: string;
  age: number;
  photo: string;
  college: string;
  verified: boolean;
  isPremiumVisible: boolean;
  likedAt: string;
}

export interface Match {
  id: number;
  name: string;
  age: number;
  photo: string;
  college: string;
  matchedAt: string;
  compatibilityScore?: number;
  mutualInterests: number;
}

export const mockLikes = {
  likes: [
    {
      id: 1,
      name: 'Sarah',
      age: 20,
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'Stanford University',
      verified: true,
      isPremiumVisible: false,
      likedAt: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jessica',
      age: 21,
      photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'UC Berkeley',
      verified: false,
      isPremiumVisible: true,
      likedAt: '5 hours ago'
    },
    {
      id: 3,
      name: 'Amanda',
      age: 22,
      photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'UCLA',
      verified: true,
      isPremiumVisible: false,
      likedAt: '1 day ago'
    },
    {
      id: 4,
      name: 'Rachel',
      age: 19,
      photo: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'USC',
      verified: false,
      isPremiumVisible: true,
      likedAt: '2 days ago'
    },
    {
      id: 5,
      name: 'Olivia',
      age: 23,
      photo: 'https://images.pexels.com/photos/1845457/pexels-photo-1845457.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'CalTech',
      verified: true,
      isPremiumVisible: false,
      likedAt: '3 days ago'
    },
    {
      id: 6,
      name: 'Mia',
      age: 20,
      photo: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'Stanford University',
      verified: false,
      isPremiumVisible: false,
      likedAt: '4 days ago'
    }
  ] as Like[],

  matches: [
    {
      id: 1,
      name: 'Emma',
      age: 20,
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'Stanford University',
      matchedAt: '10 minutes ago',
      compatibilityScore: 87,
      mutualInterests: 4
    },
    {
      id: 2,
      name: 'Ashley',
      age: 19,
      photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'Stanford University',
      matchedAt: '2 hours ago',
      compatibilityScore: 73,
      mutualInterests: 3
    },
    {
      id: 3,
      name: 'Sophia',
      age: 21,
      photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      college: 'UC Berkeley',
      matchedAt: '1 day ago',
      mutualInterests: 2
    }
  ] as Match[]
};