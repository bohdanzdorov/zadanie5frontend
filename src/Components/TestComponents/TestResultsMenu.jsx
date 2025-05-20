import "../../Styles/TestResultsMenu.css";
import { MathText } from "../MathText.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {useTranslation} from "react-i18next";

export const TestResultsMenu = ({ testResult }) => {
    const navigate = useNavigate();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const { t, i18n } = useTranslation();


    const handleEndTest = () => {
        navigate("/");
    };

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    const formatSeconds = (sec) => {
        try{
            const minutes = Math.floor(sec / 60);
            const seconds = sec % 60;
            return minutes
                ? `${minutes} min. ${seconds} sec.`
                : `${seconds} sec.`;
        }catch (e){
            console.log(e);
            return "0 minutes 0 seconds"
        }
    };
    const formatFields = (fields) => {
        try{
            const fields_en = fields.map(field => field.name_en).join(', ');
            const fields_sk = fields.map(field => field.name_sk).join(', ');

            return {
                fields_en,
                fields_sk
            };
        }catch (e){
            console.log(e);
            return "Unknown"
        }
    }

    return (
        <div className="test-panel">
            <div className="results-header">
                <h3 className="title">{t('testResultMenu.title')}</h3>
                <p className="meta">
                    <strong>{t('testResultMenu.score')}:&nbsp;</strong>
                    {testResult.total_correct}/{testResult.test_questions.length}
                </p>
                <p className="meta">
                    <strong>{t('testResultMenu.location')}:&nbsp;</strong>
                    {testResult.times_location.city_en},&nbsp;
                    {testResult.times_location.country_en}
                </p>
                <p className="meta">
                    <strong>{t('testResultMenu.timeSpent')}:&nbsp;</strong>
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
                            <div className="question-text"> <MathText text={i18n.language === "en" ? el.questions.question_text_en : el.questions.question_text_sk} /> </div>
                            <span className="toggle-indicator">{expandedIndex === index ? "▼" : "►"}</span>
                        </div>
                        {expandedIndex === index && (
                            <div className="expanded-info">
                                <p><strong>{t('testResultMenu.expandedResult.field')}:</strong> {i18n.language === "en" ? formatFields(el.questions.fields).fields_en : formatFields(el.questions.fields).fields_sk}</p>
                                <div><strong>{t('testResultMenu.expandedResult.correctAnswer')}:</strong><MathText text={i18n.language === "en" ? el.questions.right_answer_en : el.questions.right_answer_sk}/></div>
                                <p><strong>{t('testResultMenu.expandedResult.yourTime')}:</strong> {formatSeconds(Math.round(el.time_spent_seconds))}</p>
                                <p><strong>{t('testResultMenu.expandedResult.averageTime')}:</strong> {formatSeconds(Math.round(el.average_time))}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="footer">
                <button className="next-btn" onClick={handleEndTest}>{t('testResultMenu.exit')}</button>
            </div>
        </div>
    );
};
