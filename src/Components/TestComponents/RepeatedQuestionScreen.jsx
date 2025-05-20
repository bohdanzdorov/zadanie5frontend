import React from "react";
import {useTranslation} from "react-i18next";
import "../../Styles/RepeatedQuestionScreen.css"
import {MathText} from "../MathText.jsx";

export const RepeatedQuestionScreen = ({proceedToTest}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="test-panel">
            <div className="repeated-warning-content">
                <h2 className="warning-heading">⚠️ {t('repeatedQuestionScreen.warningText')}</h2>
                <p className="warning-text">
                    {t('repeatedQuestionScreen.helperText')}
                </p>
            </div>
            <button className="next-btn" onClick={proceedToTest}>
                {t('repeatedQuestionScreen.continueButton')}
            </button>
        </div>
    )
}