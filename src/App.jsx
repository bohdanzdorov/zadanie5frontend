import './App.css'
import {TestQuestionPanel} from "./TestQuestionPanel/TestQuestionPanel.jsx";
import MenuPage from "./Pages/MenuPage.jsx";

function App() {

  return (
    <>
        <MenuPage />
        {/*<TestQuestionPanel question={"How are you?"} questionType={"openEnded"} onNext={()=>{}} options={["Okay", "Well", "OK"]} questionNumber={1} totalQuestions={4}/>*/}
    </>
  )
}

export default App
