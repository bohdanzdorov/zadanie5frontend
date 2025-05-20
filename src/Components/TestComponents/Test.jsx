import {useEffect, useRef, useState} from "react";
import {TestQuestionPanel} from "./TestQuestionPanel/TestQuestionPanel.jsx";
import {RepeatedQuestionScreen} from "./RepeatedQuestionScreen.jsx";

export const Test = ({test, setResultPhase}) => {
    const [curQuestionNum, setCurQuestionNum] = useState(0)
    const [curAnswer, setCurAnswer] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNewQuestions, setIsNewQuestions] = useState(false)

    const startTimeRef = useRef(Date.now()); // ms timestamp when current question loaded

    useEffect(() => {
        setIsNewQuestions(test.is_new)
        console.log(test.is_new)
    }, [test.is_new]);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, [curQuestionNum]);

    const handleNextButtonPress = async () => {
        setIsSubmitting(true);

        const elapsedMs = Date.now() - startTimeRef.current;
        const time_spent = Math.floor(elapsedMs / 1000); // seconds

        const curToken = localStorage.getItem("token")

        try {
            const res = await fetch("http://127.0.0.1:8000/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${curToken}`,
                },
                body: JSON.stringify({
                    test_id: test.test_id,
                    question_id: test.questions[curQuestionNum].id,
                    time_spent,
                    answer: curAnswer,
                }),
            });
            const data = await res.json();
            if (data.success === true) {
                console.log("Answer saved:", data);
                setCurQuestionNum((prev) => {
                    if (prev + 1 === test.questions.length) {
                        setResultPhase();
                        return prev;
                    }
                    return prev + 1;
                });
                setCurAnswer("");
            }else{
                console.log(data.message)
            }
        } catch (err) {
            console.error("submitAnswer error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {/* Display a warning if the test is not new */}
            {!isNewQuestions ? (
                <RepeatedQuestionScreen proceedToTest={() => setIsNewQuestions(true)}/>
            ) : (
                <TestQuestionPanel
                    answer={curAnswer}
                    setAnswer={setCurAnswer}
                    question={test.questions[curQuestionNum].question_text_en}
                    questionType={test.questions[curQuestionNum].type}
                    onNext={handleNextButtonPress}
                    options={test.questions[curQuestionNum].options}
                    questionNumber={curQuestionNum + 1}
                    totalQuestions={test.questions.length}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    )
}