import React from "react";
import "../../Styles/TestLoadingScreen.css"

export const TestLoadingScreen = () => {
    return(
        <div className="test-panel">
           <div className={"loading-screen-div"}>
               <h2 className={"loading-text"}>Loading...</h2>
           </div>
        </div>
    )
}