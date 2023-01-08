import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { RouterContainer } from './RouterContainer';
import { Choice } from '../components/Pages/Choice';
import { Regis } from '../components/Pages/Regis/Regis';

import RegisR1 from '../components/Pages/Regis/Round1';
import RegisR2 from '../components/Pages/Regis/Round2';
import RegisR25 from '../components/Pages/Regis/Round2.5';
import RegisR3 from '../components/Pages/Regis/Round3';

import {
  Presentator,
  PresentatorRound1,
  PresentatorRound2,
  PresentatorRound2Topic,
} from '../components/Pages/Presentator';
import { Stream, StreamRound1 } from '../components/Pages/Stream';

function App() {
  return (
    <>
      <RouterContainer>
        <Routes>
          <Route path='/'>
            <Route index element={<Choice />} />
            <Route path='presentator'>
              <Route index element={<Presentator />} />
              <Route path='round1' element={<PresentatorRound1 />} />
              <Route path='round2'>
                <Route index element={<PresentatorRound2 />} />
                <Route path='topic/:topicId' element={<PresentatorRound2Topic />} />
              </Route>
            </Route>
            <Route path='regis'>
              <Route index element={<Regis />} />
              <Route path='round1' element={<RegisR1 />} />
              <Route path='round2' element={<RegisR2 />} />
              <Route path='round25' element={<RegisR25 />} />
              <Route path='round3' element={<RegisR3 />} />
            </Route>
            <Route path='show'>
              <Route index element={<Stream />} />
              <Route path='round1' element={<StreamRound1 />} />
              <Route path='round2' />
              <Route path='round25' />
              <Route path='round3' />
            </Route>
          </Route>
        </Routes>
      </RouterContainer>
    </>
  );
}

export default App;
