import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, TEAMS_COLLECTION } from '../../firebase';
import TeamDTO from '../Classes/Team';

const TABLE_NAME = TEAMS_COLLECTION;

export function addTeam(team: TeamDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      name: team.name,
      eliminated: team.eliminated,
      score: team.score,
    }).then((result: any) => console.log(result));
  } catch (err) {
    alert(err);
  }
}

export function updateTeam(team: TeamDTO) {
  const taskDocRef = doc(db, TABLE_NAME, team.id);

  console.log(team);

  if (team.life != undefined && team.life != null) {
    try {
      updateDoc(taskDocRef, {
        life: team.life,
        eliminated: team.eliminated,
        score: team.score,
      });
    } catch (err) {
      alert(err);
    }
  } else {
    try {
      updateDoc(taskDocRef, {
        eliminated: team.eliminated,
        score: team.score,
      });
    } catch (err) {
      alert(err);
    }
  }
}

export function deleteTeam(id: string) {
  const taskDocRef = doc(db, TABLE_NAME, id);

  try {
    deleteDoc(taskDocRef);
  } catch (err) {
    alert(err);
  }
}
