import "../../Styles/TestResultsMenu.css";
import { MathText } from "../MathText.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const TestResultsMenu = ({ testResult }) => {
    const navigate = useNavigate();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleEndTest = () => {
        navigate("/");
    };

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    const formatSeconds = (sec) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return minutes
            ? `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}`
            : `${seconds} second${seconds !== 1 ? "s" : ""}`;
    };

    return (
        <div className="test-panel">
            <div className="results-header">
                <h3 className="title">Test finished</h3>
                <p className="meta">
                    <strong>Score:&nbsp;</strong>
                    {testResult.total_correct}/{testResult.test_questions.length}
                </p>
                <p className="meta">
                    <strong>Location:&nbsp;</strong>
                    {testResult.times_location.city_en},&nbsp;
                    {testResult.times_location.country_en}
                </p>
                <p className="meta">
                    <strong>Time spent:&nbsp;</strong>
                    {formatSeconds(testResult.total_time)}
                </p>
            </div>
            <div className="answers-list">
                {testResult.test_questions.map((el, index) => (
                    <div
                        key={index}
                        className={`answer ${el.is_correct ? "correct" : "wrong"} ${expandedIndex === index ? "expanded" : ""}`}
                        onClick={() => toggleExpand(index)}
                    >
                        <div className="answer-header">
                            <p className="question-text"> <MathText text={el.questions.question_text_en} /> </p>
                            <span className="toggle-indicator">{expandedIndex === index ? "▼" : "►"}</span>
                        </div>
                        {expandedIndex === index && (
                            <div className="expanded-info">
                                <p><strong>Field:</strong> {el.questions.field_id}</p>
                                <p><strong>Correct Answer:</strong> {el.questions.right_answer_en}</p>
                                <p><strong>Your Time:</strong> {formatSeconds(Math.round(el.time_spent_seconds))}</p>
                                <p><strong>Average Time:</strong> {formatSeconds(Math.round(el.average_time))}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="footer">
                <button className="next-btn" onClick={handleEndTest}>Exit</button>
            </div>
        </div>
    );
};
