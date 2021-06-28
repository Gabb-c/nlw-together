import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import nookies from 'nookies';
import { firebaseAdmin } from 'src/services/firebase/firebase-admin';
import { Button } from 'src/components/Button';

import Link from 'next/link';
import { RoomCode } from 'src/components/RoomCode';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from 'src/contexts/auth';
import { IQuestion } from 'src/models/firebase-question';
import { Question } from 'src/components/Question';
import { useRoom } from 'src/hooks/use-room';
import { database } from '../../services/firebase/firebase';
import styles from '../../styles/pages/room.module.scss';
import buttonStyles from '../../components/Question/question.module.scss';

export const getServerSideProps: GetServerSideProps<firebaseAdmin.auth.DecodedIdToken> = async (
  ctx: GetServerSidePropsContext
): Promise<GetStaticPropsResult<firebaseAdmin.auth.DecodedIdToken>> => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    return { props: token };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {} as never,
    };
  }
};

const Room = (props: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');

  const router = useRouter();
  const { id } = router.query;

  const { questions, title } = useRoom(id as string);

  const handleSendQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      toast.dark('You must be logged to send questions...');
    }

    const question: IQuestion = {
      content: newQuestion,
      author: {
        name: user?.displayName,
        avatar: user?.photoURL,
        id: user?.uid,
      },
      isAnswerd: false,
      isHighlighted: false,
    };

    await database
      .ref(`rooms/${id as string}/questions`)
      .push(question)
      .then((response) => {
        setNewQuestion('');
        return toast.dark('Question sended!');
      })
      .catch(() => {
        toast.dark('Ops, there was an error sending your question...');
      });
  };

  const handleLike = async (questionId?: string, likeId?: string) => {
    await (likeId
      ? database
          .ref(`rooms/${id as string}/questions/${questionId as string}/likes/${likeId}`)
          .remove()
      : database.ref(`rooms/${id as string}/questions/${questionId as string}/likes`).push({
          authorId: user?.uid,
        }));
  };

  return (
    <div className={styles.pageRoom}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLogoImg}>
            <Image src="/assets/logo.svg" width={157} height={45} />
          </div>
          <RoomCode code={id as string} />
        </div>
      </header>

      <main>
        <div className={styles.roomTitle}>
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setNewQuestion(event.target.value);
            }}
            value={newQuestion}
          />

          <div className={styles.formFooter}>
            {!user ? (
              <span>
                Para fazer uma pergunta, <Link href="/">faça seu login</Link>
              </span>
            ) : (
              <div className={styles.userInfo}>
                <Image src={user.photoURL as string} width={24} height={24} alt="user info" />
                <span>{`${user.displayName as string} ( ${user.email as string} )`}</span>
              </div>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className={styles.questionList}>
          {questions.map((question) => (
            <Question {...question} key={question.id}>
              <button
                type="button"
                className={`${buttonStyles.likeButton} ${
                  question.likeId ? buttonStyles.liked : ''
                }`}
                aria-label="Marcar como gostei"
                onClick={() => handleLike(question.id, question.likeId)}
              >
                <span>{question.likeCount}</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Room;
