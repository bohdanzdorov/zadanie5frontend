import {useTranslation} from "react-i18next";

export const OpenEndedAnswer = ({answer, setAnswer, disabled}) => {
    const { t, i18n } = useTranslation();

    return(
        <div className="textarea-container">
            <textarea value={answer} onChange={(e)=>setAnswer(e.target.value)} disabled={disabled} className="answer-textarea" placeholder={t('OpenEndedAnswerPlaceholder')}></textarea>
        </div>
    )
}