import QuestionDTO from "../Classes/Question";
import { Round } from "../Classes/Round";
import { Topic } from "../Classes/Topic";

export function getScores(teamId: string, round: Round) {
  const result = round.topics
    ?.map((topic: Topic) =>
      topic.questions
        .filter((question: QuestionDTO) => question.teamId === teamId)
        .map((question: QuestionDTO) => question.points)
        .reduce((acc, cur) => {
          return acc + cur;
        }, 0)
    )
    .reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  if (result) return result;
  else return 0;
}
