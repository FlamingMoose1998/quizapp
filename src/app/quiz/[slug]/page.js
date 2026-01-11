import { getQuiz } from "@/lib/data.js";
import Quiz from "@/components/Quiz.js";

 
export default async function Page({ params }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const quizJson = await getQuiz({ name });
  
  if (!quizJson){
    return <>
      Quiz not found
    </>
  }

  return (<>
    <Quiz quizJson={quizJson} />
  </>)
}