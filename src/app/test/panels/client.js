'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";



export function Navigator({ navItemList }){
  return (<>
    <ul>
      {navItemList.map((navItem, index) => {
        return (<li key={index} className="my-2"><Button onClick={navItem.onClick}>{navItem.label}</Button></li>)
      })}
    </ul>
  </>)
}

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
      <Round roundJson={quizJson.rounds[activeRoundIndex]} />
    </main>
  </div>)
}

export function Round({ roundJson }){
  return (<>
    <div>{`${roundJson.name} (${roundJson.questions.length})`}</div>
    <ol>{roundJson.questions.map(questionJson => (<li>{questionJson['text-nl']}</li>))}</ol>
  </>)
}

function getNavItemList(quizJson, setActiveRoundIndex){
  return quizJson.rounds.map((roundJson, roundIndex) => {
    return {
      label: roundJson.name,
      onClick: () => setActiveRoundIndex(roundIndex),
    }
  })
}