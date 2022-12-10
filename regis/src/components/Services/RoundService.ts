import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import RoundDTO from "../Classes/Round";

const TABLE_NAME = "rounds"

export function addRound(round: RoundDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      name: round.name,
      status: round.status,
      questions: round.questions,
    });
  } catch (err) {
    alert(err);
  }
}

export function updateRound(round: RoundDTO) {
  const taskDocRef = doc(db, TABLE_NAME, round.id);
  try {
    updateDoc(taskDocRef, {
      status: round.status,
      questions: round.questions,
    });
  } catch (err) {
    alert(err);
  }
}

export function deleteRound(id: string) {
  const taskDocRef = doc(db, TABLE_NAME, id);
  try {
    deleteDoc(taskDocRef);
  } catch (err) {
    alert(err);
  }
}
