import PropTypes from "prop-types";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import QuestionDTO, { Status } from "../../Classes/Question";
import RoundDTO from "../../Classes/Round";
import TeamDTO from "../../Classes/Team";
import { updateQuestion } from "../../Services/QuestionService";
import { updateRound } from "../../Services/RoundService";

const Round1 = (props: any) => {
  const initState = {
    roundName: "damn",
    questions: [],
    teams: [],
  };
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  let phase: number = 1;

  const [teams, setTeams] = useState<TeamDTO[]>();
  const [rounds, setRounds] = useState<RoundDTO[]>();
  const [questions, setQuestions] = useState<QuestionDTO[]>();
  const [state, setState] = useState<{
    roundName: string;
    questions: (QuestionDTO | undefined)[];
    teams: TeamDTO[];
  }>(initState);

  useEffect(() => {
    initTeams();
    initQuestions();
    initRounds();
    setSelected(0);
  }, []);

  useEffect(() => {
    init();
  }, [teams, questions, rounds]);

  useEffect(() => {
    if (rounds) {
      let round = rounds[0];
      round.current = selected;
      updateRound(round);
    }
  }, [selected]);

  function initTeams() {
    const q = query(collection(db, "teams"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
      setTeams(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          eliminated: doc.data().eliminated,
          score: doc.data().score,
        }))
      );
    });
  }
  function initQuestions() {
    const q = query(collection(db, "questions"));
    onSnapshot(q, (querySnapshot) => {
      setQuestions(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          statement: doc.data().statement,
          answer: doc.data().answer,
          flavor: doc.data().flavor,
          points: doc.data().points,
          teamId: doc.data().teamId,
          status: doc.data().status,
        }))
      );
    });
  }
  function initRounds() {
    const q = query(collection(db, "round"));
    onSnapshot(q, (querySnapshot) => {
      setRounds(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          status: doc.data().status,
          questions: doc.data().questions,
          current: doc.data().current,
        }))
      );
    });
  }

  function init() {
    const rd = rounds?.find(
      (item: RoundDTO) => item.id === "5Jv20rWadBAd4ZmKxNBq"
    );

    const qsts =
      rd?.questions.map((item: string) =>
        questions?.find((question: QuestionDTO) => question.id === item)
      ) || [];
    const tms: TeamDTO[] = teams?.splice(4) || [];
    setState({
      roundName: rd?.name || "oups",
      questions: qsts,
      teams: tms,
    });
  }

  function handlePrevious() {
    if (questions) {
        if (selected !== 0) {
          setSelected(selected - 1);
        }
    }
  }
  function handleNext() {
    if (questions) {
      if (selected !== questions?.length) {
        setSelected(selected + 1);
      }
    }
  }

  function handleShowQuestion() {
    if (questions) {
      let question = questions[selected];
      if (question) {
        question.status = 1;
        updateQuestion(question);
      }
    }
  }
  function handleShowAnswer() {
    if (questions) {
      let question = questions[selected];
      if (question) {
        question.status = 2;
        updateQuestion(question);
      }
    }
  }
  function handleShowWinner() {
    if (questions) {
      let question = questions[selected];
      if (question) {
        question.status = 3;
        updateQuestion(question);
      }
    }
  }
  return (
    <>
      <div className="row wrapper">
        <div className="col content">
          <button onClick={() => navigate(-1)}>back</button>
          <div className="teams">
            {teams?.map((team: TeamDTO) => (
              <div className="team-item">
                <span>{team.name}</span>
                <span>{team.score}</span>
              </div>
            ))}
          </div>

          <h1>Ici le {state.roundName}</h1>
          <div className="table-content grow1">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Réponse</TableCell>
                    <TableCell>Saveur</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Answered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.questions.map((question: QuestionDTO | undefined) => (
                    <TableRow
                      key={question?.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      selected={
                        questions
                          ? questions[selected].id === question?.id
                          : false
                      }
                      className={question?.status ? "answered" : "not-answered"}
                    >
                      <TableCell component="th" scope="row">
                        {question?.statement}
                      </TableCell>
                      <TableCell align="right">{question?.answer}</TableCell>
                      <TableCell align="right">{question?.flavor}</TableCell>
                      <TableCell align="right">{question?.points}</TableCell>
                      <TableCell align="right">
                        {
                          state.teams.find(
                            (item: TeamDTO | undefined) =>
                              item?.id === question?.id
                          )?.name
                        }
                      </TableCell>
                      <TableCell align="right">{question?.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <span>Stream</span>
          <div className="nav-question row">
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="nav"
            >
              Question Précédente
            </Button>
            <div className="grow1 row stream-board-list">
              <Button variant="outlined" onClick={handleShowQuestion}>
                Afficher Question
              </Button>
              <Button variant="outlined" onClick={handleShowAnswer}>
                Afficher Réponse
              </Button>
              <Button variant="outlined" onClick={handleShowWinner}>
                Afficher Vainqueur
              </Button>
            </div>
            <Button variant="contained" onClick={handleNext} className="nav">
              Question Précédente
            </Button>
          </div>
        </div>
        <div className="col side-panel">
          <div className="soundboard"></div>
          <div className="nav-panel"></div>
        </div>
      </div>
    </>
  );
};
export default Round1;
