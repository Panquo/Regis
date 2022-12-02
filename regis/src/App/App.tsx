import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { RouterContainer } from "./RouterContainer";
import { Choice } from "../components/Pages/Choice";
import { Presenter } from "../components/Pages/Presenter";
import { Regis } from "../components/Pages/Regis";
import { Show } from "../components/Pages/Show";
function App() {
  return (
    <>
      <RouterContainer>
        <Routes>
          <Route path="/">
            <Route index element={<Choice/>}/>
            <Route path="pres" element={<Presenter/>}/>
            <Route path="regis" element={<Regis/>}/>
            <Route path="show" element={<Show/>}/>
          </Route>
        </Routes>
      </RouterContainer>
    </>
  );
}

export default App;
