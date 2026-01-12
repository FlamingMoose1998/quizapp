'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import clsx from "clsx";
import { Round } from "./Round.js";


export function Quiz({ quizJson }) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(null);
  const navItemList = getNavItemList(quizJson, setActiveRoundIndex, activeRoundIndex);

  return (<div className="grid h-screen grid-rows-[100px_1fr] grid-cols-[150px_1fr]">
    <header className="col-span-2 bg-blue-500 flex items-center justify-center text-white">
      {/* (Height: 100px, Full Width) */}
      {quizJson.name}
    </header>

    <aside className="bg-gray-200 flex justify-center border-r border-gray-300">
      {/* Sidebar (Width: 150px) */}
      <Navigator navItemList={navItemList} />
    </aside>

    <main className="bg-white p-4">
      {/* Main Content (Fills remaining space) */}
      <MainPanel quizJson={quizJson} activeRoundIndex={activeRoundIndex} />
    </main>
  </div>)
}

export function Navigator({ navItemList }) {
  return (<>
    <ul>
      {navItemList.map((navItem, index) => {       
        return (<li key={index} className="my-2">
          <Button onClick={navItem.onClick} className={clsx('w-32 h-12 border-b-4', navItem.active ? 'border-indigo-500' : '')} variant="outline">
            <div>
              <div>{navItem.label}</div>
              <div className="text-[10px]">{navItem.theme}</div>
            </div>
          </Button>
        </li>)
      })}
    </ul>
  </>)
}



export function MainPanel({ quizJson, activeRoundIndex }) {
  if (activeRoundIndex === null) {
    return <Overview quizJson={quizJson} />
  }

  return <Round quizJson={quizJson} roundIndex={activeRoundIndex} />
}

export function Overview({ quizJson }) {
  return (<>Overview for {quizJson.name}</>)
}


function getNavItemList(quizJson, setActiveRoundIndex, activeRoundIndex) {
  const navItemList = quizJson.rounds.map((roundJson, roundIndex) => {
    return {
      label: `Ronde ${roundJson.roundNumber}`,
      theme: roundJson.theme || '',
      onClick: () => setActiveRoundIndex(roundIndex),
      index: roundIndex,
    }
  })

  navItemList.unshift({
    label: 'Overview',
    onClick: () => setActiveRoundIndex(null),
    index: null,
  })

  return navItemList.map(item => ({
    ...item,
    active: (item.index === activeRoundIndex),
  }));
}