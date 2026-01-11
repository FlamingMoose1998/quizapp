'use client'

import { Activity, useState } from "react";
import Link from "next/link.js";

/**
 * Shows quizzes in a list under a heading.
 * The list expands/collapses
 *
 * @typedef {object} MultiQuizProps
 * @property {string[]} quizList - list of quizzes
 * @property {string} title - title of the list
 *
 * @param {MultiQuizProps} props
 * @returns {JSX.Element}
 */
export default function MultiQuiz({ quizList, title }) {
  const [show, setShow] = useState(true);

  return (<>
    <div className="text-3xl font-bold ml-4" onClick={() => setShow(!show)}>{title}<span className="text-sm ml-4">({quizList.length})</span></div>
    <Activity mode={show ? 'visible' : 'hidden'}>
      <div>
        {quizList.map((quiz, index) => <QuizListItem key={index} quiz={quiz} />)}
      </div>

    </Activity>
  </>)
}

/**
 * Single item to be shown in a list
 *
 * @typedef {object} QuizListItemProps
 * @property {Object} quiz - object containing quiz data
 *
 * @param {QuizListItemProps} props
 * @returns {JSX.Element}
 */
function QuizListItem({ quiz }) {
  const validState = (typeof quiz.valid !== 'boolean')
    ? 'not validated'
    : quiz.valid
      ? 'valid'
      : 'invalid';

  return (<div className="border-solid border-2 m-3">
    <Link href={{
      pathname: `/quiz/${quiz.number} - ${quiz.name}`
    }}>
      <div className="text-2xl ml-2">{quiz.name}</div>
      <div className="ml-4">{quiz.state} - {validState}</div>

    </Link>
  </div>)
}