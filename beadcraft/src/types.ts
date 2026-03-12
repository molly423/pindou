export type UserProfile = {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  bio: string;
};

export type Pattern = {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  image: string;
  likes: number;
  beadCount?: number;
  gridSize: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  publishedAt: string;
  colors?: BeadColor[];
};

export type BeadColor = {
  name: string;
  code: string;
  hex: string;
  count: number;
};

export type SavedProject = {
  id: string;
  title: string;
  grid: (string | null)[];
  width: number;
  height: number;
  updatedAt: number;
};

export type Comment = {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
};
