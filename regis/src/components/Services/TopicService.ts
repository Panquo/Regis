import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import TeamDTO from "../Classes/Team";
import TopicDTO from "../Classes/Topic";

const TABLE_NAME = "topics"

export function addTopic(topic:TopicDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      name: topic.name,
      status: topic.status,
      questions: topic.questions,
      current: topic.current,
    }).then((result:any)=>console.log(result));
  } catch (err) {
    alert(err);
  }
}

export function updateTopic(topic: TopicDTO) {
  const taskDocRef = doc(db, TABLE_NAME, topic.id);
  try {
    updateDoc(taskDocRef, {
      status: topic.status,
      current: topic.current,
    });
  } catch (err) {
    alert(err);
  }
}

export function deleteTopic(id: string) {
  const taskDocRef = doc(db, TABLE_NAME, id);
  try {
    deleteDoc(taskDocRef);
  } catch (err) {
    alert(err);
  }
}
