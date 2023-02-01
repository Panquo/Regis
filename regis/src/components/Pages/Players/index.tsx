import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';

const PlayerDisplay = () => {
  const [roundIndex, setRoundIndex] = useState(0);

  const changeRoundIndex = () => {
    const q = query(collection(db, 'context'));

    onSnapshot(q, (querySnapshot) => {
      const { roundIndex } = querySnapshot.docs[0].data();

      setRoundIndex(roundIndex);
    });
  };

  useEffect(() => {
    changeRoundIndex();
  }, []);

  useEffect(() => {
    changeRoundIndex();
  }, [roundIndex]);

  const renderDisplay = (index: number) => {
    switch (index) {
      case 1:
        return <h1>Round 1</h1>;
      case 2:
        return <h1>Round 2</h1>;
      case 2.5:
        return <h1>Round 2.5</h1>;
      case 3:
        return <h1>Round 3</h1>;
      default:
        return <h1>Le jeu arrive bientôt :)</h1>;
    }
  };

  return <>{renderDisplay(roundIndex)}</>;
};

export default PlayerDisplay;
