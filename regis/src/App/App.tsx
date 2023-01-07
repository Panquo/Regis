import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { RouterContainer } from './RouterContainer';
import { Choice } from '../components/Pages/Choice';
import { Regis } from '../components/Pages/Regis/Regis';
import { Show } from '../components/Pages/Show';

import RegisR1 from '../components/Pages/Regis/Round1';
import RegisR2 from '../components/Pages/Regis/Round2';
import RegisR25 from '../components/Pages/Regis/Round2.5';
import RegisR3 from '../components/Pages/Regis/Round3';

import { Presentator, PresentatorRound1 } from '../components/Pages/Presentator';

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
            </Route>
            <Route path='regis'>
              <Route index element={<Regis />} />
              <Route path='round1' element={<RegisR1 />} />
              <Route path='round2' element={<RegisR2 />} />
              <Route path='round25' element={<RegisR25 />} />
              <Route path='round3' element={<RegisR3 />} />
            </Route>
            <Route path='show' element={<Show />} />
          </Route>
        </Routes>
      </RouterContainer>
    </>
  );
}

export default App;
