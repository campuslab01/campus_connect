export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isDMRequest: boolean;
  messages: {
    text: string;
    time: string;
    isOwn: boolean;
  }[];
  compatibilityScore?: number;
}



export const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Hey! How was your CS project presentation?',
    time: '2m',
    unreadCount: 2,
    isOnline: true,
    isDMRequest: false,
    compatibilityScore: 87,
    messages: [
      { text: 'Hey! Nice to match with you 😊', time: '10:30 AM', isOwn: false },
      { text: 'Hi Emma! Thanks, you seem really interesting too!', time: '10:35 AM', isOwn: true },
      { text: 'I saw you\'re also in CS. What\'s your favorite programming language?', time: '10:37 AM', isOwn: false },
      { text: 'I love JavaScript and React! Currently working on a web app for a startup', time: '10:40 AM', isOwn: true },
      { text: 'That\'s awesome! I\'m more into Python and ML. We should collaborate sometime!', time: '10:42 AM', isOwn: false },
      { text: 'Definitely! I\'d love to learn more about ML from you', time: '10:45 AM', isOwn: true },
      { text: 'How was your CS project presentation?', time: '11:00 AM', isOwn: false }
    ]
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'The rock climbing spot I mentioned is amazing!',
    time: '1h',
    unreadCount: 0,
    isOnline: false,
    isDMRequest: false,
    messages: [
      { text: 'Hi Michael! I love your photos from the climbing trip', time: 'Yesterday 8:20 PM', isOwn: true },
      { text: 'Thanks! You should come climbing with us sometime', time: 'Yesterday 8:25 PM', isOwn: false },
      { text: 'I\'d love to! I\'m still a beginner though', time: 'Yesterday 8:27 PM', isOwn: true },
      { text: 'Perfect! We have routes for all levels. The rock climbing spot I mentioned is amazing!', time: 'Today 9:15 AM', isOwn: false }
    ]
  },
  {
    id: 3,
    name: 'Sofia Rodriguez',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'I\'d love to connect! What\'s your Instagram?',
    time: '5m',
    unreadCount: 1,
    isOnline: true,
    isDMRequest: true,
    messages: [
      { text: 'Hey! I really like your profile. I\'d love to connect! What\'s your Instagram?', time: '2:45 PM', isOwn: false }
    ]
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Thanks for the coffee shop recommendation!',
    time: '10m',
    unreadCount: 0,
    isOnline: true,
    isDMRequest: true,
    messages: [
      { text: 'Hi! I noticed we both love photography and coffee. Thanks for the coffee shop recommendation!', time: '2:30 PM', isOwn: false }
    ]
  },
  {
    id: 5,
    name: 'Ashley Thompson',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Study group sounds great!',
    time: '3h',
    unreadCount: 0,
    isOnline: false,
    isDMRequest: false,
    compatibilityScore: 73,
    messages: [
      { text: 'Hi Ashley! I see we\'re both at Stanford', time: 'Today 11:00 AM', isOwn: true },
      { text: 'Hey! Yeah, I love it here. What year are you?', time: 'Today 11:05 AM', isOwn: false },
      { text: 'I\'m a sophomore in CS. You\'re pre-med right?', time: 'Today 11:07 AM', isOwn: true },
      { text: 'Yes! It\'s challenging but I love it. Maybe we can form a study group?', time: 'Today 11:10 AM', isOwn: false },
      { text: 'Study group sounds great!', time: 'Today 11:15 AM', isOwn: true }
    ]
  }
];