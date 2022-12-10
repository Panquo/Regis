import { useEffect, useState } from 'react'
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
import TopicDTO from '../Classes/Topic';

type Props = {}

export const TopicController = (props: Props) => {
    const [topics, setTopics] = useState<TopicDTO[]>([]);

  const topic: TopicDTO = {
    id:"",
    name: 'banane',
    status: 0,
    questions: [],
    current:0
  };

  useEffect(() => {
    const q = query(collection(db, "topics"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setTopics(
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

  function addTopic() {
    try {
      addDoc(collection(db, "topics"), {
        name: topic.name,
        status: topic.status,
        questions: topic.questions,
      });
    } catch (err) {
      alert(err);
    }
  }

  function updateTopic(topic: TopicDTO) {
    const taskDocRef = doc(db, "topics", topic.id);
    try {
      updateDoc(taskDocRef, {
        status: topic.status,
        questions: topic.questions,
      });
    } catch (err) {
      alert(err);
    }
  }

  function deleteTopic(id: string) {
    const taskDocRef = doc(db, "topics", id);
    try {
      deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div>
        <button onClick={addTopic}>AddTopic</button>
        <ul>
          {topics?.map((item: any) => (
            <li>
              {item.name}
              {item.status}
              
              <button onClick={() => deleteTopic(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
  )
}
