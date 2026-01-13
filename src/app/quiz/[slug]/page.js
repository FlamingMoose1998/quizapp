import { getQuiz } from "@/lib/data.js";
import { Quiz } from "@/components/quiz/Quiz.js";
import { validateQuiz } from "@/lib/quiz/validate-tree.js";

 
export default async function Page({ params }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const quizJson = await getQuiz({ name });
  await validateQuiz(quizJson);  
  
  if (!quizJson){
    return <>
      Quiz not found
    </>
  }

  return (<>
    <Quiz quizJson={quizJson} />
  </>)
}