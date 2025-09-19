export interface Confession {
  id: number;
  author?: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  comments: number;
  shares?: number;
  isAnonymous: boolean;
  college: string;
  tags?: string[];
  recentComments?: {
    author: string;
    text: string;
    time: string;
  }[];
}

export const mockConfessions: Confession[] = [
  {
    id: 1,
    text: "I've had a crush on someone in my chemistry lab for months but I'm too nervous to talk to them. They always smell like vanilla and have the most beautiful handwriting when taking notes. I look forward to lab days just to sit near them 😍",
    time: '2 hours ago',
    likes: 47,
    comments: 12,
    isAnonymous: true,
    college: 'Stanford University',
    tags: ['crush', 'chemistry', 'nervous'],
    recentComments: [
      { author: 'Sarah M.', text: 'You should totally talk to them! Maybe ask about the lab assignment?', time: '1h ago' },
      { author: 'Anonymous', text: 'Vanilla scent is the best! Go for it 💪', time: '45m ago' }
    ]
  },
  {
    id: 2,
    author: 'Jessica L.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: "Can we normalize being single in college? I'm tired of feeling like I need to be in a relationship to be complete. I'm focusing on my career goals and personal growth, and that's perfectly valid! 💪✨",
    time: '4 hours ago',
    likes: 89,
    comments: 23,
    isAnonymous: false,
    college: 'UC Berkeley',
    tags: ['single', 'selfcare', 'growth']
  },
  {
    id: 3,
    text: "I matched with my TA on a dating app and now every class is incredibly awkward. They haven't said anything but we both know. The tension during office hours is unbearable 😅 Should I drop the class?",
    time: '6 hours ago',
    likes: 134,
    comments: 45,
    isAnonymous: true,
    college: 'USC',
    tags: ['awkward', 'TA', 'dating'],
    recentComments: [
      { author: 'Mike_2024', text: 'Happened to my friend too! They waited until after the semester', time: '3h ago' },
      { author: 'Anonymous', text: 'Don\'t drop! Just keep it professional for now', time: '2h ago' }
    ]
  },
  {
    id: 4,
    text: "Long distance relationships in college are so much harder than I thought they'd be. Missing movie nights and study dates with my high school sweetheart while trying to make new friends here. Anyone else struggling with this? 💔",
    time: '8 hours ago',
    likes: 67,
    comments: 31,
    isAnonymous: true,
    college: 'UCLA',
    tags: ['longdistance', 'relationships', 'college']
  },
  {
    id: 5,
    author: 'David Park',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    text: "Shoutout to the person who left encouraging notes in the library study rooms during finals week last semester. Those little 'you got this!' messages really made my day. Whoever you are, thank you! 📚❤️",
    time: '12 hours ago',
    likes: 156,
    comments: 28,
    isAnonymous: false,
    college: 'Stanford University',
    tags: ['wholesome', 'finals', 'kindness']
  },
  {
    id: 6,
    text: "I think I accidentally ghosted someone really nice because I got overwhelmed with midterms. Now I'm too embarrassed to text them back after 3 weeks. How do I fix this without looking like a complete mess? 😭",
    time: '1 day ago',
    likes: 93,
    comments: 52,
    isAnonymous: true,
    college: 'UC Berkeley',
    tags: ['ghosting', 'anxiety', 'dating'],
    recentComments: [
      { author: 'Emma_22', text: 'Just be honest! Most people understand college stress', time: '12h ago' },
      { author: 'Anonymous', text: 'Send a cute meme and apologize. Works every time!', time: '8h ago' }
    ]
  }
];