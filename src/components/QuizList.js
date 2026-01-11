'use client'

import { Button } from "./ui/button.jsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';


export default function QuizList({ quizList }) {
  console.log('clientQuizList')

  return (
    <ul>
      {quizList.map((quiz, index) => (
        // <li key={index}><Button onClick={() => onClickTest(quizList[index])}>{quiz.name}</Button></li>
        <QuizCard quiz={quiz} index={index} key={index} />
      ))}
    </ul>
  )
}

function QuizCard({ quiz, index }) {
  const {
    name,
    number,
    audience,
    date,
    state,
  } = quiz;
  const fullName = `${number} - ${name}`;

  return (<>
    <li>
      <Card className="w-full max-w-sm">
        <Link href={{
          pathname: `/quiz/${encodeURIComponent(fullName)}`,
          // as: `/quiz/${quiz.uuid}`,
        }}
        >
          <CardHeader>
            <CardTitle>
              {fullName}
            </CardTitle>
            <CardDescription>
              {audience} - {date || 'no date'} - {state || 'no state'}
            </CardDescription>
          </CardHeader>
        </Link>
        <CardContent>
          <Link href={{
            pathname:`/quiz-validate/${encodeURIComponent(fullName)}`
          }}>
            <Button>Validate</Button>
          </Link>
        </CardContent>
      </Card>
    </li>
  </>)
}