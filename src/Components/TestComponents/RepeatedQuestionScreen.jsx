import React from "react";

export const RepeatedQuestionScreen = ({proceedToTest}) => {
    return (
        <div className="test-panel">
            <h2>Warning: This test contains some repeated questions.</h2>
            <p>Please note that you have already answered to some of the questions in this test.</p>
            <button className="next-btn" onClick={proceedToTest}>Continue</button>
        </div>
    )
}