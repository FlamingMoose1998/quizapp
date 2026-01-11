'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";


export default function Test({ id }){
  const [counter, setCounter] = useState(id)
  return (<>
    <b>Id: {id}</b>
    <Button onClick={() => setCounter(counter + 1)}>{counter}</Button>
  </>)
}