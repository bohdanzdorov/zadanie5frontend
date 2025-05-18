export const OpenEndedAnswer = ({answer, setAnswer, disabled}) => {
    return(
        <div className="textarea-container">
            <textarea value={answer} onChange={(e)=>setAnswer(e.target.value)} disabled={disabled} className="answer-textarea" placeholder="Type your answer here..."></textarea>
        </div>
    )
}