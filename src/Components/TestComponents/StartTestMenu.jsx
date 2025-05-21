import '../../Styles/StartTestMenu.css'
import {useTranslation} from "react-i18next";
import BackButton from "../BackButton.jsx";

export const StartTestMenu = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="main-div">
            <BackButton/>
            <div className={"test-panel start-menu"}>
                <h3 className={"start-test-menu-header"}>{t('startTestMenu.testInfo')}</h3>
                <button className={"next-btn"} onClick={props.setTestingPhase}>{t('startTestMenu.startButton')}</button>
            </div>
        </div>

    )
}