import React from "react";
import {useTranslation} from "react-i18next";

export const RepeatedQuestionScreen = ({proceedToTest}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="test-panel">
            <h2>{t('repeatedQuestionScreen.warningText')}</h2>
            <p>{t('repeatedQuestionScreen.helperText')}</p>
            <button className="next-btn" onClick={proceedToTest}>{t('repeatedQuestionScreen.continueButton')}</button>
        </div>
    )
}