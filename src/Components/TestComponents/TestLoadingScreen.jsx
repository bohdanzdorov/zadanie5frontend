import React from "react";
import "../../Styles/TestLoadingScreen.css"
import {useTranslation} from "react-i18next";

export const TestLoadingScreen = () => {
    const { t, i18n } = useTranslation();

    return(
        <div className="test-panel">
           <div className={"loading-screen-div"}>
               <h2 className={"loading-text"}>{t('testLoadingScreen')}</h2>
           </div>
        </div>
    )
}