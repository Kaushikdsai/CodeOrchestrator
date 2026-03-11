import Editor from '@monaco-editor/react';

function CodeEditor({ code,setCode,className,language }){
    return (
        <div className={className}>
            <Editor
                height="65vh"
                width="170vh"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
            />
        </div>
    );
}

export default CodeEditor;