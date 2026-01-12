import { getCategoryInfo } from "@/lib/quiz/categories.js";

export function QuestionList({ questionList }){
  return questionList.map((question, index) => <QuestionListItem key={index} question={question} />)
}

function QuestionListItem({ question }){
  const { bgColor, borderColor } = getCategoryInfo(question.category);


  return (<div className="flex flex-row h-min-14 m-2">
    <div className={`w-14 h-14 flex items-center justify-center border-4 rounded-full ${borderColor} text-2xl`}>{question.nr}</div>
    <div className="w-400 ml-4">
      <div>{question['text-nl']}</div>
      <div>{question['answer-nl']}</div>
    </div>
    <div>
      <div>{question.category}</div>
      <div>{question.difficulty}</div>
    </div>
  </div>)
}