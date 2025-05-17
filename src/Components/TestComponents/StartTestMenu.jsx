import '../../Styles/StartTestMenu.css'

export const StartTestMenu = (props) => {
    return (
       <div className={"test-panel"}>
           <h3 className={"start-test-menu-header"}>You can generate new test with 10 random questions by clicking the button below</h3>
           <button className={"next-btn"} onClick={props.setTestingPhase}>Start</button>
       </div>
    )
}