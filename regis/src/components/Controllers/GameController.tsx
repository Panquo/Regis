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
import GameDTO from "../Classes/Game";

type Props = {};

export const GameController = (props: Props) => {
  const [games, setGames] = useState<GameDTO[]>([]);

  const game: GameDTO = {
    name: "QPUI",
    status: 0,
    rounds: [],
    id: "",
    current:0
  };

  useEffect(() => {
    const q = query(collection(db, "game"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setGames(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          status: doc.data().status,
          rounds: doc.data().rounds,
          current: doc.data().current,
        }))
      );
    });
  }, []);

  function addGame() {
    try {
      addDoc(collection(db, "game"), {
        name: game.name,
        status: game.status,
        rounds: game.rounds,
      });
    } catch (err) {
      alert(err);
    }
  }

  function updateGame(game: GameDTO) {
    const taskDocRef = doc(db, "game", game.id);
    try {
      updateDoc(taskDocRef, {
        status: game.status,
        rounds: game.rounds,
      });
    } catch (err) {
      alert(err);
    }
  }

  function deleteGame(id: string) {
    const taskDocRef = doc(db, "game", id);
    try {
      deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div>
      <button onClick={addGame}>AddGame</button>
      <ul>
        {games?.map((item: any) => (
          <li>
            {item.name}
            {item.status}
            <button
              onClick={() =>
                updateGame({
                  id: item.id,
                  name: "nom",
                  status: 25,
                  rounds: game.rounds,
                  current:0
                })
              }
            >
              Update
            </button>
            <button onClick={() => deleteGame(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
