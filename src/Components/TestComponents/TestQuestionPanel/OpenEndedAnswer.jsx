export const OpenEndedAnswer = ({answer, setAnswer}) => {
    return(
        <div className="textarea-container">
            <textarea value={answer} onChange={(e)=>setAnswer(e.target.value)} className="answer-textarea" placeholder="Type your answer here..."></textarea>
        </div>
    )
}