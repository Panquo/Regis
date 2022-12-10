import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import GameDTO from "../Classes/Game";

const TABLE_NAME = "games"

export function addGame(game: GameDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      name: game.name,
      status: game.status,
      rounds: game.rounds,
    });
  } catch (err) {
    alert(err);
  }
}

export function updateGame(game: GameDTO) {
  const taskDocRef = doc(db, TABLE_NAME, game.id);
  try {
    updateDoc(taskDocRef, {
      status: game.status,
      rounds: game.rounds,
    });
  } catch (err) {
    alert(err);
  }
}

export function deleteGame(id: string) {
  const taskDocRef = doc(db, TABLE_NAME, id);
  try {
    deleteDoc(taskDocRef);
  } catch (err) {
    alert(err);
  }
}
