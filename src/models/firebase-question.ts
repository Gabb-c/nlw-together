export interface IQuestion {
  id?: string;
  content: string;
  author: Author;
  isHighlighted: boolean;
  isAnswerd: boolean;
  likeCount?: number | null;
  likeId?: string;
}

export interface FirebaseQuestion {
  id?: string;
  content: string;
  author: Author;
  isHighlighted: boolean;
  isAnswerd: boolean;
  likes?: Record<string, { authorId: string }>;
}

export interface Author {
  id: string | undefined | null;
  name: string | undefined | null;
  avatar: string | undefined | null;
}

export type FirebaseQuestions = Record<string, FirebaseQuestion>;
