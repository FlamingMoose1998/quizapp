import QuizQls from '@/components/QuizQls.js'
import { getQuiz } from "@/lib/data.js";

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
    <QuizQls quizJson={quizJson} />
  </>)
}