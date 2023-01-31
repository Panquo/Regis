import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import QuestionDTO from '../Classes/Question';

const TABLE_NAME = 'questions';

export function addQuestion(question: QuestionDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      statement: question.statement,
      answer: question.answer,
      points: question.points,
      teamId: question.teamId,
      status: question.status,
      answerStatus: question.answerStatus,
    });
  } catch (err) {
    alert(err);
  }
}

export function updateQuestion(question: QuestionDTO) {
  const taskDocRef = doc(db, TABLE_NAME, question.id);

  console.log(question);

  try {
    updateDoc(taskDocRef, {
      statement: question.statement,
      answer: question.answer,
      points: question.points,
      teamId: question.teamId,
      status: question.status,
      answerStatus: question.answerStatus,
    });
  } catch (err) {
    alert(err);
  }
}

export function deleteQuestion(id: string) {
  const taskDocRef = doc(db, TABLE_NAME, id);

  try {
    deleteDoc(taskDocRef);
  } catch (err) {
    alert(err);
  }
}
