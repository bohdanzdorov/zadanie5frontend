import '../../Styles/StartTestMenu.css'
import {useTranslation} from "react-i18next";

export const StartTestMenu = (props) => {
    const { t, i18n } = useTranslation();

    return (
       <div className={"test-panel"}>
           <h3 className={"start-test-menu-header"}>{t('startTestMenu.testInfo')}</h3>
           <button className={"next-btn"} onClick={props.setTestingPhase}>{t('startTestMenu.startButton')}</button>
       </div>
    )
}