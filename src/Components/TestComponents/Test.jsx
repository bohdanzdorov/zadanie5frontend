import {useEffect, useRef, useState} from "react";
import {TestQuestionPanel} from "./TestQuestionPanel/TestQuestionPanel.jsx";

export const Test = ({test, setResultPhase}) => {
    const [curQuestionNum, setCurQuestionNum] = useState(0)
    const [curAnswer, setCurAnswer] = useState("")

    const startTimeRef = useRef(Date.now()); // ms timestamp when current question loaded

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, [curQuestionNum]);

    const handleNextButtonPress = async () =>{
        const elapsedMs = Date.now() - startTimeRef.current;
        const time_spent = Math.floor(elapsedMs / 1000); // seconds

        fetch("http://127.0.0.1:8000/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                test_id: test.test_id,
                question_id: test.questions[curQuestionNum].id,
                time_spent: time_spent,
                answer: curAnswer,
            }),
        }).then((res) => {
            if (!res.ok) {
                return res.text().then((msg) => {
                    throw new Error(msg || "Failed to submit answer");
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log("Answer saved:", data);
            setCurQuestionNum((prev)=> {
                if(prev+1 === test.questions.length){
                    setResultPhase()
                    return prev
                }
                return prev+1
            });
            setCurAnswer("")
            return data;
        })
        .catch((err) => {
            console.error("submitAnswer error:", err);
            throw err;
        });
    }

    return (
        <TestQuestionPanel answer={curAnswer} setAnswer={setCurAnswer} question={test.questions[curQuestionNum].question_text_en} questionType={test.questions[curQuestionNum].type} onNext={handleNextButtonPress} options={test.questions[curQuestionNum].options} questionNumber={curQuestionNum+1} totalQuestions={test.questions.length}/>
    )
}