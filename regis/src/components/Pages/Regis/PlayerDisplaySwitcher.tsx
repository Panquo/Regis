import { updateContext } from '../../Services/ContextService';

const PlayerDisplaySwitcher = () => {
  return (
    <>
      <button onClick={() => updateContext(1)}>Round 1</button>
      <button onClick={() => updateContext(2)}>Round 2</button>
      <button onClick={() => updateContext(2.5)}>Round 2.5</button>
      <button onClick={() => updateContext(3)}>Round 3</button>
    </>
  );
};

export default PlayerDisplaySwitcher;
