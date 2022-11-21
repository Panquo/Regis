import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import QuestionDTO from "../Classes/Question";

type Props = {};

export const QuestionController = (props: Props) => {
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);

  const question: QuestionDTO = {
    id: "",
    statement: "ouioui",
    answer: "",
    points: 0,
    bonus: 0,
    teamId: 0,
    status: 0,
  };

  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("statement", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setQuestions(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          statement: doc.data().statement,
          answer: doc.data().answer,
          points: doc.data().points,
          bonus: doc.data().bonus,
          teamId: doc.data().teamId,
          status: doc.data().status,
        }))
      );
    });
  }, []);

  function addQuestion() {
    try {
      addDoc(collection(db, "questions"), {
        statement: question.statement,
        answer: question.answer,
        points: question.points,
        bonus: question.bonus,
        teamId: question.teamId,
        status: question.status,
      });
    } catch (err) {
      alert(err);
    }
  }

  function updateQuestion(question: QuestionDTO) {
    const taskDocRef = doc(db, "questions", question.id);
    try {
      updateDoc(taskDocRef, {
        statement: question.statement,
        answer: question.answer,
        points: question.points,
        bonus: question.bonus,
        teamId: question.teamId,
        status: question.status,
      });
    } catch (err) {
      alert(err);
    }
  }

  function deleteQuestion(id: string) {
    const taskDocRef = doc(db, "questions", id);
    try {
      deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div>
      <button onClick={addQuestion}>AddQuestion</button>
      <ul>
        {questions?.map((item: any) => (
          <li>
            {item.name}
            {item.statement}
            <button
              onClick={() =>
                updateQuestion({
                  id: item.id,
                  statement: "banana",
                  answer: "",
                  points: 0,
                  bonus: 0,
                  teamId: 0,
                  status: 0
                })
              }
            >
              Update
            </button>
            <button onClick={() => deleteQuestion(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
