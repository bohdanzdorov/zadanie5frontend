import React from 'react';
import '../../../Styles/TestQuestionPanel.css';
import {MultipleChoiceAnswer} from "./MultipleChoiceAnswer.jsx";
import {OpenEndedAnswer} from "./OpenEndedAnswer.jsx";
import { BlockMath, InlineMath } from "react-katex";
import {MathText} from "../../MathText.jsx";


export const TestQuestionPanel = ({ answer, setAnswer, question, questionType, questionNumber, totalQuestions, options, onNext, isSubmitting }) => {
    const isLastQuestion = questionNumber === totalQuestions;

    return (
        <div className="test-panel">
            <div className="header">
                <div className="question-text"><MathText text={question}/></div>
                <div className="question-info">{`${questionNumber}/${totalQuestions}`}</div>
            </div>
            <div className="divider"></div>
            {
                questionType === "multiple_choice" && <MultipleChoiceAnswer options={options} answer={answer} setAnswer={setAnswer} disabled={isSubmitting}/>
            }
            {
                questionType === "open_answer" && <OpenEndedAnswer answer={answer} setAnswer={setAnswer} disabled={isSubmitting}/>
            }
            <button className="next-btn" onClick={onNext} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isLastQuestion ? 'End test' : 'Next'}
            </button>
        </div>
    );
};

