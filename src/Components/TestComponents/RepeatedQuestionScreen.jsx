import React from "react";
import "../../Styles/RepeatedQuestionScreen.css"
import {MathText} from "../MathText.jsx";

export const RepeatedQuestionScreen = ({proceedToTest}) => {
    return (
        <div className="test-panel">
            <div className="repeated-warning-content">
                <h2 className="warning-heading">⚠️ Warning: Repeated Questions</h2>
                <p className="warning-text">
                  Some of the questions in this test were already answered earlier. Your responses might be used for validation purposes.
                </p>
            </div>
            <button className="next-btn" onClick={proceedToTest}>
                Continue
            </button>
        </div>
    )
}