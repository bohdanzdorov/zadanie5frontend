import React from "react";

export const MultipleChoiceAnswer = ({options}) => {
    return (
        <div className="options">
            {options.map((option, index) => (
                <div key={index} className="option">
                    <input type="radio" id={`option-${index}`} name="answer" value={option} />
                    <label htmlFor={`option-${index}`}>{option}</label>
                </div>
            ))}
        </div>
    )
}