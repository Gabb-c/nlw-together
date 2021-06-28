import { FirebaseQuestions } from './firebase-question';

export interface FirebaseRoom {
  title: string;
  authorId: number;
  questions: FirebaseQuestions;
  endedAt?: Date;
}
