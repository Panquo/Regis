import logo from "../logo.svg";
import "./App.css";
import { TopicController } from "../components/Controllers/TopicController";
import { QuestionController } from "../components/Controllers/QuestionController";
import { GameController } from "../components/Controllers/GameController";
import { RoundController } from "../components/Controllers/RoundController";
function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <RoundController/>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
