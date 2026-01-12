'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { writeRoundQls } from "@/lib/data.js";


export function Quiz({ quizJson }){
  const [activeRoundIndex, setActiveRoundIndex] = useState(null);
  const navItemList = getNavItemList(quizJson, setActiveRoundIndex);

  return (<div className="grid h-screen grid-rows-[100px_1fr] grid-cols-[150px_1fr]">
    <header className="col-span-2 bg-blue-500 flex items-center justify-center text-white">
      {/* (Height: 100px, Full Width) */}
      {quizJson.name} 
    </header>

    <aside className="bg-gray-200 flex justify-center border-r border-gray-300">
      {/* Sidebar (Width: 150px) */}
      <Navigator navItemList={navItemList} />
    </aside>

    <main className="bg-white flex items-center justify-center">
      {/* Main Content (Fills remaining space) */}
      <MainPanel quizJson={quizJson} activeRoundIndex={activeRoundIndex} />
    </main>
  </div>)
}

export function Navigator({ navItemList }){
  return (<>
    <ul>
      {navItemList.map((navItem, index) => {
        return (<li key={index} className="my-2"><Button onClick={navItem.onClick}>{navItem.label}</Button></li>)
      })}
    </ul>
  </>)
}

export function MainPanel({ quizJson, activeRoundIndex }){
  if (activeRoundIndex === null){
    return <Overview quizJson={quizJson} />
  }

  return <Round quizJson={quizJson} roundIndex={activeRoundIndex} />
}

export function Overview({ quizJson }){
  return (<>Overview for {quizJson.name}</>)
}

export function Round({ quizJson, roundIndex }){
  const roundJson = quizJson.rounds[roundIndex];

  return (<>
    <div>{`${roundJson.name} (${roundJson.questions.length})`}</div>
    <Button onClick={() => writeRoundQls(quizJson, roundIndex)}>💾 QLS</Button>
    <ol>{roundJson.questions.map((questionJson, questionIndex) => (<li key={questionIndex}>{questionJson['text-nl']}</li>))}</ol>
  </>)
}

function getNavItemList(quizJson, setActiveRoundIndex){
  const navItemList = quizJson.rounds.map((roundJson, roundIndex) => {
    return {
      label: roundJson.name,
      onClick: () => setActiveRoundIndex(roundIndex),
    }
  })

  navItemList.unshift({
    label: 'Overview',
    onClick: () => setActiveRoundIndex(null)
  })

  return navItemList;
}