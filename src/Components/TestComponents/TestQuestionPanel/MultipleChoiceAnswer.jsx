import React from "react";
import {MathText} from "../../MathText.jsx";
import {useTranslation} from "react-i18next";

export const MultipleChoiceAnswer = ({ options, answer, setAnswer, disabled}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="options flex flex-col gap-3">
            {options.map((option, index) => {
                const value = i18n.language === "en" ? option.option_en : option.option_sk
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
                            disabled={disabled}
                            className="accent-blue-600"
                        />
                        <span><MathText text={value}/></span>
                    </label>
                );
            })}
        </div>
    );
};
