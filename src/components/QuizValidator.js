'use client'

import { Button } from "@/components/ui/button.jsx";
import { useState, useEffect } from "react";
import { Activity } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { writeQuiz } from '@/lib/data.js';


export default function QuizValidator({ validationJson, quizJson = {} }){
  const [showRounds, setShowRounds] = useState(false);
  return (<>
    <div className="text-2xl font-bold flex flex-row" onClick={() => setShowRounds(!showRounds)}><Valid valid={validationJson.valid} />{quizJson.name}</div>
    <Activity mode={validationJson.autoFix ? 'visible' : 'hidden'}>
      <Button onClick={() => writeQuiz({ quizJson })}>Save fixed</Button>
    </Activity>
    <Activity mode={showRounds ? 'visible' : 'hidden'}>
      {validationJson.valRounds.map((valRound, roundIndex) => {
        const roundJson = quizJson.rounds[roundIndex];
        return <RoundValidator key={roundIndex} roundValidationJson={valRound} roundJson={roundJson} />
      })}
    </Activity>
  </>)
}

function RoundValidator({ roundValidationJson, roundJson }){
  const [showQuestions, setShowQuestions] = useState(false);

  if (roundJson.type === '1ak') return (<>
    <div className="text-xl font-bold flex flex-row" onClick={() => setShowQuestions(!showQuestions)}><Valid valid={roundValidationJson.valid} />{roundJson.name}</div>
    <Activity mode={showQuestions ? 'visible' : 'hidden'}>
      this is an 1ak round for which we do not yet have a validator component
    </Activity>
  </>)

  return (<>
    <div className="text-xl font-bold flex flex-row" onClick={() => setShowQuestions(!showQuestions)}><Valid valid={roundValidationJson.valid} />{roundJson.name}</div>
    <Activity mode={showQuestions ? 'visible' : 'hidden'}>
      {roundValidationJson.valQuestions.map((questionValidationJson, questionIndex) => {
        const questionJson = roundJson.questions[questionIndex];
        return <QuestionValidator key={questionIndex} questionValidationJson={questionValidationJson} questionJson={questionJson} />
      })}
    </Activity>
  </>)
}

function QuestionValidator({ questionValidationJson, questionJson }){
  const [showChecks, setShowChecks] = useState(false);

  return (<div className="flex flex-row">
    <ValidQuestion questionValidationJson={questionValidationJson} />
    <div className="w-10">{questionJson.nr}</div>
    <div>{questionJson['text-nl']}</div>
  </div>)
}

function Valid({ valid }){
  return <div className="w-10">{valid ? '✅' : '❌'}</div>;
}

function ValidQuestion({ questionValidationJson }){
  return (<div className="w-10">
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">{questionValidationJson.valid ? '✅' : '❌'}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  </div>)
}

