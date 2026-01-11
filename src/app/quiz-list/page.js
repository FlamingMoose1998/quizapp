import { getQuizList } from "@/lib/data.js";
import QuizList from "@/components/QuizList.js";

export default async function Page(){
  const quizList = await getQuizList();

  
  return (<>
    <QuizList quizList={quizList} />
  </>)
}
