import React, { useEffect, useState } from 'react'
import TeamDTO from "../Classes/Team";
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

type Props = {}

export const TeamController = (props: Props) => {
    const [teams, setTeams] = useState<TeamDTO[]>([]);

  const team: TeamDTO = {
    id: "",
    name: "OUi",
    eliminated: false,
    score: 0,
  };

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setTeams(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          eliminated: doc.data().eliminated,
          score: doc.data().score,
        }))
      );
    });
  }, []);

  function addTeam() {
    try {
      addDoc(collection(db, "teams"), {
        name: team.name,
        eliminated: team.score,
        score: team.score,
      }).then((result:any)=>console.log(result));
    } catch (err) {
      alert(err);
    }
  }

  function updateTeam(team: TeamDTO) {
    const taskDocRef = doc(db, "teams", team.id);
    try {
      updateDoc(taskDocRef, {
        eliminated: team.eliminated,
        score: team.score,
      });
    } catch (err) {
      alert(err);
    }
  }

  function deleteTeam(id: string) {
    const taskDocRef = doc(db, "teams", id);
    try {
      deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div>
        <button onClick={addTeam}>AddTeam</button>
        <ul>
          {teams?.map((item: any) => (
            <li>
              {item.name}
              {item.score}
              <button onClick={() => updateTeam({
                id: item.id,
                name: "oué",
                eliminated: true,
                score: 10
              })}>Update</button>
              <button onClick={() => deleteTeam(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
  )
}