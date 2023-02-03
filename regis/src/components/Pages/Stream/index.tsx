import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';

import { default as StreamRound1 } from './Round1';
import { default as StreamRound2 } from './Round2';
import { default as StreamRound25 } from './Round2.5';
import { default as StreamRound3 } from './Round3';

const Stream = () => {
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
  }, [roundIndex]);

  const renderStream = (index: number) => {
    switch (index) {
      case 1:
        return <StreamRound1 />;
      case 2:
        return <StreamRound2 />;
      case 2.5:
        return <StreamRound25 />;
      case 3:
        return <StreamRound3 />;
      default:
        return <h1>Le jeu arrive bientôt :)</h1>;
    }
  };

  return <>{renderStream(roundIndex)}</>;
};

export default Stream;
