import QuestionDTO from "../Classes/Question";
import { Round } from "../Classes/Round";
import { Topic } from "../Classes/Topic";

export function getScores(teamId: string, round: Round) {
  let result = 0
  if(round.topics){
    result = round.topics
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
  }else if(round.questions){
    result = round.questions
    ?.filter((question: QuestionDTO) => question.teamId === teamId)
        .map((question: QuestionDTO) => question.points)
        .reduce((acc, cur) => {
          return acc + cur;
        }, 0)
  }
  if (result) return result;
  else return 0;
}
