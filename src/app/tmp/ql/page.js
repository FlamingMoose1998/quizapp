import { getQuizList } from "@/lib/data.js";
import { sortQuizList } from "@/lib/quiz/quiz-list-utils.js";
import MultiQuiz from "@/components/MultiQuiz.js";

export default async function Page(){
  const quizList = await getQuizList();

  const {
    open,
    closedValid,
    closedNotValid
  } = await sortQuizList(quizList)

  return (<>
    <MultiQuiz quizList={open} title={`In draft`} />
    <MultiQuiz quizList={closedValid} title={`Valid`} />
    <MultiQuiz quizList={closedNotValid} title={`Not valid`} />
  </>)
  
}