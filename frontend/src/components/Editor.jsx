import Editor from '@monaco-editor/react';

function CodeEditor({ code,setCode }){
    return (
        <Editor
            height="40vh"
            width="90vh"
            language="java"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
        />
    );
}

export default CodeEditor;