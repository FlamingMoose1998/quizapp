import QuizValidator from "@/components/QuizValidator.js";
import { validateQuiz } from "@/lib/quiz/validate-tree.js";
import { getQuiz } from "@/lib/data.js";



export default async function Page({ params }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const quizJson = await getQuiz({ name });
  const validationJson = await validateQuiz(quizJson);
  
  if (!validationJson){
    return <>
      Quiz not found
    </>
  }

  return (<>
    <QuizValidator validationJson={validationJson} quizJson={quizJson} />
  </>)
}