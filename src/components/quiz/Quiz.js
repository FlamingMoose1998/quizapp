'use client'
import { useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import clsx from "clsx";
import { Round } from "./Round.js";
import { useQueryState, parseAsInteger } from 'nuqs';


export function Quiz({ quizJson }) {
  const [roundNumber, setRoundNumber] = useQueryState(
    'r',
    parseAsInteger.withDefault(0)
  )

  const navItemList = getNavItemList(quizJson, setRoundNumber, roundNumber);

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
      <MainPanel quizJson={quizJson} roundNumber={roundNumber} />
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



export function MainPanel({ quizJson, roundNumber }) {
  if (roundNumber === 0) {
    return <Overview quizJson={quizJson} />
  }

  return <Round quizJson={quizJson} roundNumber={roundNumber} />
}

export function Overview({ quizJson }) {
  return (<>Overview for {quizJson.name}</>)
}


function getNavItemList(quizJson, setRoundNumber, roundNumber) {
  let navItemList = quizJson.rounds.map((roundJson, roundIndex) => {
    return {
      label: `Ronde ${roundJson.roundNumber} ${roundJson.valid ? '✅' : '❌'}`,
      theme: roundJson.theme || '',
      onClick: () => setRoundNumber(roundIndex + 1),
      roundNumber: roundIndex + 1,
    }
  })

  navItemList.unshift({
    label: 'Overview',
    onClick: () => setRoundNumber(0),
    roundNumber: 0,
  })

  navItemList =  navItemList.map(item => ({
    ...item,
    active: (item.roundNumber === roundNumber),
  }));

  return navItemList;
}