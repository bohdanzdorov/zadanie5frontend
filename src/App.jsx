import './App.css'
import {TestQuestionPanel} from "./Components/TestComponents/TestQuestionPanel/TestQuestionPanel.jsx";
import MenuPage from "./Pages/MenuPage.jsx";
import {StartTestMenu} from "./Components/TestComponents/StartTestMenu.jsx";
import {TestPage} from "./Pages/TestPage.jsx";

function App() {

  return (
    <>
        <TestPage/>
        {/*<MenuPage />*/}
        {/*<TestQuestionPanel question={"How are you?"} questionType={"openEnded"} onNext={()=>{}} options={["Okay", "Well", "OK"]} questionNumber={1} totalQuestions={4}/>*/}
    </>
  )
}

export default App
