import React from "react";
import {MathText} from "../../MathText.jsx";

export const MultipleChoiceAnswer = ({ options, answer, setAnswer }) => {
    return (
        <div className="options flex flex-col gap-3">
            {options.map((option, index) => {
                const value = option.option_en ?? "";
                return (
                    <label
                        key={index}
                        htmlFor={`option-${index}`}
                        className="option flex items-center gap-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            id={`option-${index}`}
                            name="answer"
                            value={value}
                            checked={answer === value}
                            onChange={() => setAnswer(value)}
                            className="accent-blue-600"
                        />
                        <span><MathText text={value}/></span>
                    </label>
                );
            })}
        </div>
    );
};
