import React from 'react';
import { FirebaseRoom } from 'src/models/firebase-room';
import { IQuestion } from 'src/models/firebase-question';
import { useAuth } from 'src/contexts/auth';
import { database } from '../services/firebase/firebase';

export interface RoomData {
  questions: IQuestion[];
  title: string;
}

export const useRoom = (roomId: string): RoomData => {
  const [questions, setQuestions] = React.useState<IQuestion[]>([]);
  const [title, setTitle] = React.useState<string>('');
  const { user } = useAuth();

  React.useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val() as FirebaseRoom;
      const firebaseQuestions = databaseRoom.questions ?? {};

      const parsedQestions: IQuestion[] = Object.entries(firebaseQuestions).map(([key, value]) => ({
        content: value.content,
        author: value.author,
        isAnswerd: value.isAnswerd,
        isHighlighted: value.isHighlighted,
        id: key,
        likeCount: Object.values(value.likes ?? {}).length,
        likeId: Object.entries(value.likes ?? {}).find(
          ([index, like]) => like.authorId === user?.uid
        )?.[0],
      }));

      setTitle(databaseRoom.title);
      setQuestions(parsedQestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.uid]);

  return { questions, title };
};
