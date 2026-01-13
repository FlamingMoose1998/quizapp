'use client'

import { writeRoundQls } from "@/lib/data.js";
import { Button } from "../ui/button.jsx";
import { QuestionList } from "./QuestionList.js";

export function Round({ quizJson, roundNumber }) {
  const roundIndex = roundNumber - 1;
  const roundJson = quizJson.rounds[roundIndex];

  return (<div>
    <div className="grid grid-row text-3xl">
      <div>{`${roundJson.name} (${roundJson.questions.length})`}</div>
      <div><Button onClick={() => writeRoundQls(quizJson, roundIndex)} variant="outline">💾 QLS</Button></div>
    </div>
    
    <QuestionList questionList={roundJson.questions} />
  </div>)
}
