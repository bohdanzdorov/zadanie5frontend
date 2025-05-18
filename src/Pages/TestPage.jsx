import { useEffect, useState } from "react";
import { StartTestMenu } from "../Components/TestComponents/StartTestMenu.jsx";
import { Test } from "../Components/TestComponents/Test.jsx";
import { TestResultsMenu } from "../Components/TestComponents/TestResultsMenu.jsx";
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
            /* ---------- 2) Translate to Slovak via LibreTranslate ---------- */
            // const translate = async (text) => {
            //
            //     const res = await fetch("https://libretranslate.com/translate", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             q: "",
            //             source: "auto",
            //             target: "sk",
            //             format: "text",
            //             alternatives: 3,
            //             api_key: ""
            //         }),
            //     });
            //
            //     if (!res.ok) throw new Error("Translation failed");
            //     const data = await res.json();
            //     console.log(data)
            //     return data.translatedText || text;
            // };
            //
            // const [country_sk, city_sk] = await Promise.all([
            //     translate(country_en),
            //     translate(city_en),
            // ]);


            /* ---------- 3) Current ISO time ---------- */
            const pad = (n) => n.toString().padStart(2, "0");
            const d = new Date();
            const start_time =
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
                `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

            /* ---------- 4) Fetch the test ---------- */
            const url = new URL("http://127.0.0.1:8000/test");
            url.searchParams.append("country_en", country_en);
            url.searchParams.append("country_sk", country_en);
            url.searchParams.append("city_en", city_en);
            url.searchParams.append("city_sk", city_en);
            url.searchParams.append("start_time", start_time);

            const testRes = await fetch(url.toString());
            if (!testRes.ok) throw new Error("Failed to fetch test");
            const testData = await testRes.json();

            setTestState(1);
            setTest(testData);
        } catch (err) {
            console.error("start test error:", err);
        }
    };

    const getTestResults = async () => {
        setTestState(3)
        const url = new URL(`http://127.0.0.1:8000/test/${test.test_id}`);

        const testRes = await fetch(url.toString());
        if (!testRes.ok) throw new Error("Failed to fetch test");
        const testData = await testRes.json();

        setTestState(2)
        setTestResult(testData)
    }


    return (
        <>
            {testState === 0 ? (
                <StartTestMenu setTestingPhase={setTestingPhase} />
            ) : testState === 1 ? (
                <Test setResultPhase={setResultsPhase} test={test}/>
            ) : testState === 2 ? (
                <TestResultsMenu testResult={testResult}/>
            ) : <TestLoadingScreen/>}
        </>
    );
};
