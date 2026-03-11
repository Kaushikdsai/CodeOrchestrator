import "../styles/OutputPanel.css"

function OutputPanel({ output }){
    return (
        <div className="output-container">
            <h3>OUTPUT</h3>
            <pre>{output}</pre>
        </div>
    )
}

export default OutputPanel;