import {useEffect, useState} from "react";
import {StartTestMenu} from "../Components/TestComponents/StartTestMenu.jsx";
import {Test} from "../Components/TestComponents/Test.jsx";
import {TestResultsMenu} from "../Components/TestComponents/TestResultsMenu.jsx";
import {TestLoadingScreen} from "../Components/TestComponents/TestLoadingScreen.jsx";

export const TestPage = () => {
    // 0‑start, 1‑testing, 2‑results, 3-loading
    const [testState, setTestState] = useState(0);
    const [test, setTest] = useState(null);
    const [testResult, setTestResult] = useState()

    const setTestingPhase = () => startTest();
    const setResultsPhase = () => getTestResults();

    const startTest = async () => {
        try {
            setTestState(3)
            /* ---------- 1) Get EN location from ipapi.co ---------- */
            const ipRes = await fetch("https://ipapi.co/json/");
            const ipData = await ipRes.json();
            const country_en = ipData.country_name || "Slovakia";
            const city_en = ipData.city || "Bratislava";

            console.log(city_en)

            /* ---------- 3) Current ISO time ---------- */
            const pad = (n) => n.toString().padStart(2, "0");
            const d = new Date();
            const start_time =
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
                `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

            const excluded_question_ids = JSON.parse(localStorage.getItem("question_ids") || "[]");  // Getting previous question_ids if stored

            const requestBody = {
                country_en: country_en,
                country_sk: country_en,
                city_en: city_en,
                city_sk: city_en,
                start_time: start_time,
                excluded_question_ids: excluded_question_ids,
            };

            const headers = {
                "Content-Type": "application/json",
            };

            //Current user token
            const curToken = localStorage.getItem("token");

            if (curToken) {
                headers['Authorization'] = `Bearer ${curToken}`;
            } else {
                headers['X-Guest-ID'] = localStorage.getItem("guest_id");
            }

            console.log(JSON.stringify(headers))
            const testRes = await fetch("http://127.0.0.1:8000/test", {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
            });


            const testData = await testRes.json();

            if (testData.success === true) {
                if (!testData.response.is_new) {
                    console.log("Test created with some repeated questions.");
                }

                let existingQuestionIds = JSON.parse(localStorage.getItem("question_ids") || "[]");
                const newQuestionIds = testData.response.questions.map(q => q.id);

                const updatedQuestionIds = [
                    ...new Set([...existingQuestionIds, ...newQuestionIds])
                ];

                // 9) Update localStorage with the new question IDs list
                localStorage.setItem("question_ids", JSON.stringify(updatedQuestionIds));

                setTestState(1);
                setTest(testData.response);
            } else {
                console.log(testData.message)
            }
        } catch (err) {
            console.error("start test error:", err);
        }
    };

    const getTestResults = async () => {
        setTestState(3)
        const url = new URL(`http://127.0.0.1:8000/test/${test.test_id}`);

        const headers = {
            "Content-Type": "application/json",
        };

        //Current user token
        const curToken = localStorage.getItem("token");

        if (curToken) {
            headers['Authorization'] = `Bearer ${curToken}`;
        } else {
            headers['X-Guest-ID'] = localStorage.getItem("guest_id");
        }

        const testRes = await fetch(url.toString(), {
            method: "GET",
            headers
        });
        const testData = await testRes.json();
        if (testData.success === true) {
            console.log(testData.response)
            setTestState(2)
            setTestResult(testData.response)
        } else {
            console.log(testData.message)
            console.log(testData.errors)
        }
    }

    return (
        <>
            {testState === 0 ? (
                <StartTestMenu setTestingPhase={setTestingPhase}/>
            ) : testState === 1 ? (
                <Test setResultPhase={setResultsPhase} test={test}/>
            ) : testState === 2 ? (
                <TestResultsMenu testResult={testResult}/>
            ) : <TestLoadingScreen/>}
        </>
    );
};
