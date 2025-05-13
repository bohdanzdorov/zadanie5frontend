import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {TestQuestionPanel} from "./TestQuestionPanel/TestQuestionPanel.jsx";

function App() {

  return (
    <>
        <TestQuestionPanel question={"How are you?"} questionType={"openEnded"} onNext={()=>{}} options={["Okay", "Well", "OK"]} questionNumber={1} totalQuestions={4}/>
    </>
  )
}

export default App
