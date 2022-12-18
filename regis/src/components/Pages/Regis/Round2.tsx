import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import QuestionDTO from "../../Classes/Question";
import RoundDTO, { Round } from "../../Classes/Round";
import TeamDTO from "../../Classes/Team";
import TopicDTO, { Topic } from "../../Classes/Topic";
import { updateQuestion } from "../../Services/QuestionService";
import { updateRound } from "../../Services/RoundService";
import { updateTeam } from "../../Services/TeamService";
import { getScores } from "../../utils/TeamUtils";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const round: Round = {
  id: "",
  name: "",
  status: 0,
  questions: [],
  current: 0,
};

const Round2 = (props: any) => {
  const initState = {
    round: round,
    teams: [],
  };
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const [teams, setTeams] = useState<TeamDTO[]>();
  const [chosenTopic, setChosenTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicDTO[]>([]);
  const [rounds, setRounds] = useState<RoundDTO[]>();
  const [questions, setQuestions] = useState<QuestionDTO[]>();
  const [state, setState] = useState<{
    round: Round;
    teams: TeamDTO[];
  }>(initState);

  useEffect(() => {
    initTeams();
    initQuestions();
    initRounds();
    initTopics();
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
  function initTopics() {
    const q = query(collection(db, "topics"));
    onSnapshot(q, (querySnapshot) => {
      setTopics(
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

    const tpc: Topic = {
      id: "",
      name: "",
      status: 0,
      questions: [],
      current: 0,
    };
    const qst: QuestionDTO = {
      id: "",
      statement: "",
      answer: "",
      flavor: "",
      points: 0,
      teamId: "",
      status: 0,
    };

    if (topics) {
      const tpcs =
        rd?.questions.map((item: string) => {
          const topic = topics.find((topic: TopicDTO) => topic.id === item);
          if (topic) {
            const tpc = {
              ...topic,
              questions: topic.questions.map(
                (item: string) =>
                  questions?.find(
                    (question: QuestionDTO) => item === question.id
                  ) || qst
              ),
            };
            return tpc;
          } else {
            return tpc;
          }
        }) || [];
      const round: Round = {
        id: rd?.id || "",
        name: rd?.name || "",
        status: rd?.status || 0,
        topics: tpcs,
        current: rd?.current || 0,
      };
      const tms: TeamDTO[] = teams || [];

      setState({
        round: round,
        teams: tms,
      });
    }
  }

  function handlePreviousQuestion() {
    if (questions) {
      if (selected !== 0) {
        setSelected(selected - 1);
      }
    }
  }
  function handleNextQuestion() {
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
      if (question && question.teamId) {
        question.status = 3;
        updateQuestion(question);
        updateTeams();
      }
    }
  }
  function updateTeams() {
    setTeams(
      teams?.map((team: TeamDTO) => ({
        ...team,
        score: [
          getScores(team.id, state.round),
          team.score[1],
          team.score[2],
          team.score[3],
        ],
      }))
    );
  }

  function handlePreviousRound() {
    navigate("/regis/round1");
  }
  function handleNextRound() {
    navigate("/regis/round3");
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

          <h1>Ici le {state.round.name}</h1>
          <div className="table-content grow1">
            {chosenTopic ? (
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
                    {state.round.topics
                      ?.find((item: Topic) => item.id === chosenTopic)
                      ?.questions.map((question: QuestionDTO | undefined) => (
                        <TableRow
                          key={question?.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          selected={
                            questions
                              ? questions[selected].id === question?.id
                              : false
                          }
                          className={
                            question?.status ? "answered" : "not-answered"
                          }
                        >
                          <TableCell component="th" scope="row">
                            {question?.statement}
                          </TableCell>
                          <TableCell align="right">
                            {question?.answer}
                          </TableCell>
                          <TableCell align="right">
                            {question?.flavor}
                          </TableCell>
                          <TableCell align="right">
                            {question?.points}
                          </TableCell>
                          <TableCell align="right">
                            <InputLabel id="winnerTeam">Gagnant</InputLabel>
                            <Select
                              labelId="winnerTeam"
                              value={
                                state.teams.find(
                                  (item: TeamDTO) =>
                                    question?.teamId === item.id
                                )?.id
                              }
                              onChange={(event: any) => {
                                if (question) {
                                  question.teamId = event.target.value;
                                  console.log(event);

                                  updateQuestion(question);
                                }
                              }}
                            >
                              {state.teams.map((item: TeamDTO) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                              ))}
                            </Select>
                            {
                              state.teams.find(
                                (item: TeamDTO | undefined) =>
                                  item?.id === question?.id
                              )?.name
                            }
                          </TableCell>
                          <TableCell align="right">
                            {question?.status}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {state.round.topics?.map((item: Topic) => {
                  return (
                    <Grid xs={4}>
                      <Item>{item.name}</Item>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </div>
          <span>Stream</span>
          <div className="nav-question row">
            <Button
              variant="contained"
              onClick={handlePreviousQuestion}
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
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              className="nav"
            >
              Question Suivante
            </Button>
          </div>
        </div>
        <div className="col side-panel">
          <div className="soundboard"></div>
          <div className="nav-panel">
            <Button onClick={handlePreviousRound}>Manche Précédente</Button>
            <Button onClick={handleNextRound}>Manche Suivante</Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Round2;
