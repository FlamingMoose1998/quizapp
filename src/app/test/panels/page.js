import { getQuiz } from "@/lib/data.js"
import { Quiz } from "./client.js";


export default async function Page() {
  const quizJson = await getQuiz({ name: 'QUIZ-260001 - Mets 3.5'})
  console.log(quizJson.name)
  return (<Quiz quizJson={quizJson} />)
}

