import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const TABLE_NAME = 'context';

export function updateContext(roundIndex: number) {
  const contextDocRef = doc(db, TABLE_NAME, 'regis_context');

  try {
    updateDoc(contextDocRef, {
      roundIndex: roundIndex,
    });
  } catch (err) {
    alert(err);
  }
}
