import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, TOPICS_COLLECTION } from '../../firebase';
import TopicDTO, { extractTopic } from '../Classes/Topic';

const TABLE_NAME = TOPICS_COLLECTION;

export async function fetchTopic(topicId: string) {
  const topicDoc = doc(db, TABLE_NAME, topicId);
  const topic = await getDoc(topicDoc);

  return extractTopic(topic);
}

export function addTopic(topic: TopicDTO) {
  try {
    addDoc(collection(db, TABLE_NAME), {
      name: topic.name,
      status: topic.status,
      questions: topic.questions,
      current: topic.current,
    }).then((result: any) => console.log(result));
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
      teamId: topic.teamId,
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
