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
import RoundDTO from "../Classes/Round";

type Props = {};

export const RoundController = (props: Props) => {
  const [rounds, setRounds] = useState<RoundDTO[]>([]);

  const round: RoundDTO = {
    id: "",
    name: "round",
    status: 0,
    questions: [],
    current: 0,
  };

  useEffect(() => {
    const q = query(collection(db, "round"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setRounds(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          status: doc.data().status,
          questions: doc.data().questions,
          current: doc.data().current,
        }))
      );
    });
  }, []);

  function addRound(round: RoundDTO) {
    try {
      addDoc(collection(db, "round"), {
        name: round.name,
        status: round.status,
        questions: round.questions,
      });
    } catch (err) {
      alert(err);
    }
  }

  function updateRound(round: RoundDTO) {
    const taskDocRef = doc(db, "round", round.id);
    try {
      updateDoc(taskDocRef, {
        status: round.status,
        questions: round.questions,
      });
    } catch (err) {
      alert(err);
    }
  }

  function deleteRound(id: string) {
    const taskDocRef = doc(db, "round", id);
    try {
      deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div>
      <button onClick={() => addRound(round)}>AddRound</button>
      <ul>
        {rounds?.map((item: any) => (
          <li>
            {item.name}
            {item.status}
            
            <button onClick={() => deleteRound(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
