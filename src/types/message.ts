import { Timestamp } from 'firebase/firestore';

export interface Message {
  id?: string;
  fullName: string;
  country: string;
  message: string;
  createdAt: Timestamp | any; 
  createdAtUnix: number;
  status: 'approved';
  likes: number;
  heartReactions: number;
  smileReactions: number;
  celebrateReactions: number;
  anonymousId: string;
  isPinned: boolean;
  isEdited: boolean;
}

export type ReactionType = 'likes' | 'heartReactions' | 'smileReactions' | 'celebrateReactions';
