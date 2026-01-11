'use client'

import { Button } from "./ui/button.jsx"
import { writeRoundQls } from '@/lib/data.js'

export default function QuizQls({ quizJson }){
  return (<>
    <div>{quizJson.fullName}</div>
    {quizJson.rounds.map((roundJson, roundIndex) => {
      return (<Button key={roundIndex} onClick={() => writeRoundQls(quizJson, roundIndex)}>{roundJson.name}</Button>)
    })}
  </>)
}