import {useEffect, useRef, useState} from "react";
import {TestQuestionPanel} from "./TestQuestionPanel/TestQuestionPanel.jsx";
import {RepeatedQuestionScreen} from "./RepeatedQuestionScreen.jsx";
import {useTranslation} from "react-i18next";

export const Test = ({test, setResultPhase}) => {
    const { t, i18n } = useTranslation();

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

    const handleNextButtonPress = async () =>{
        setIsSubmitting(true);

        const elapsedMs = Date.now() - startTimeRef.current;
        const time_spent = Math.floor(elapsedMs / 1000); // seconds

        try {
            const res = await fetch("http://127.0.0.1:8000/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    test_id: test.test_id,
                    question_id: test.questions[curQuestionNum].id,
                    time_spent,
                    answer: curAnswer,
                }),
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to submit answer");
            }
            const data = await res.json();
            console.log("Answer saved:", data);
            setCurQuestionNum((prev) => {
                if (prev + 1 === test.questions.length) {
                    setResultPhase();
                    return prev;
                }
                return prev + 1;
            });
            setCurAnswer("");
        } catch (err) {
            console.error("submitAnswer error:", err);
            alert(t('test.errorMessage'));
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <>
            {/* Display a warning if the test is not new */}
            {!isNewQuestions ? (
                <RepeatedQuestionScreen proceedToTest={()=>setIsNewQuestions(true)}/>
            ) : (
                <TestQuestionPanel
                    answer={curAnswer}
                    setAnswer={setCurAnswer}
                    question={i18n.language === "en" ? test.questions[curQuestionNum].question_text_en : test.questions[curQuestionNum].question_text_sk}
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