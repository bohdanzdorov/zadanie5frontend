import React from 'react';
import './TestQuestionPanel.css';
import {MultipleChoiceAnswer} from "./MultipleChoiceAnswer.jsx";
import {OpenEndedAnswer} from "./OpenEndedAnswer.jsx";

export const TestQuestionPanel = ({ question, questionType, questionNumber, totalQuestions, options, onNext }) => {
    const isLastQuestion = questionNumber === totalQuestions;

    return (
        <div className="test-question-panel">
            <div className="header">
                <div className="question-text">{question}</div>
                <div className="question-info">{`${questionNumber}/${totalQuestions}`}</div>
            </div>
            <div className="divider"></div>
            {
                questionType === "multipleChoice" && <MultipleChoiceAnswer options={options}/>
            }
            {
                questionType === "openEnded" && <OpenEndedAnswer/>
            }
            <button className="next-btn" onClick={onNext}>
                {isLastQuestion ? 'Submit' : 'Next'}
            </button>
        </div>
    );
};

