'use client'

import { getNrFilledQuestions } from "@/lib/quiz/round-utils.js"
import { ListRestart } from "lucide-react"
import { Button } from "./ui/button.jsx"
import { writeRoundQls } from "@/lib/data.js"
import Link from "next/link.js"
import { useState } from "react"

export default function Quiz({ quizJson }) {
  const [selectedRound, setSelectedRound] = useState(0)
  return (<>
    <QuizHeader quizJson={quizJson} />
    <div className="flex justify-between">
      {quizJson.rounds.map((roundJson, roundIndex) => (
        <RoundButton
          key={roundIndex}
          quizJson={quizJson}
          roundIndex={roundIndex}
          selectRound={(roundIndex) => setSelectedRound(roundIndex)}
        />
      ))}
    </div>
    <Round roundJson={quizJson.rounds[selectedRound]} />
  </>)
}

function QuizHeader({ quizJson }) {
  return (<>
    <div className="text-3xl text-center bg-blue-200 border-solid border-2 rounded-md mx-4 my-2 py-4">
      <div>{quizJson.name}</div>
      <div className="text-sm">{quizJson.number}</div>
    </div>
  </>)
}

function RoundButton({ quizJson, roundIndex, selectRound, isActive }) {
  const roundJson = quizJson.rounds[roundIndex];
  const nrNotEmptyQuestions = getNrFilledQuestions(roundJson)
  const questionsStateText = (typeof nrNotEmptyQuestions === 'number') ? `${nrNotEmptyQuestions} questions` : roundJson.type;
  const fullName = `${quizJson.number} - ${quizJson.name}`


  const outerClasses = `bg-grey-100 border-solid border-2`

  return (<>
    <div className={outerClasses}>
      <div className="text-2xl" onClick={() => selectRound(roundIndex)}>{roundJson.name}</div>
      <div className="grid content-center">
        <div className="text-sm mb-2">{questionsStateText}</div>
        <div><Button variant="outline" className="w-24" onClick={() => writeRoundQls(quizJson, roundIndex)}>💾 QLS</Button></div>
      </div>
    </div>
  </>)
}

function Round({ roundJson }) {
  return (<>
    {roundJson.name}
  </>)
}