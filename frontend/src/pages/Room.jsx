import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import CodeEditor from "../components/Editor";
import OutputPanel from "../components/OutputPanel";
import { socket } from "../services/socket";
import Navbar from "../components/Navbar";

function Room(){
    const { roomId }=useParams();

    const [code,setCode]=useState("");
    const [output,setOutput]=useState("");

    const token=sessionStorage.getItem("token");

    useEffect(() => {
        const token=sessionStorage.getItem("token");
        socket.auth={ token };
        if(!socket.connected){
            socket.connect();
        }

        const joinRoom = () => {
            console.log("Joining room:", roomId);
            socket.emit("join-room", { roomId });
        };
        if(socket.connected){
            joinRoom();
        }
        else{
            socket.on("connect", joinRoom);
        }

        socket.on("code-update", (newCode) => {
            console.log("Received:", newCode);
            setCode(newCode);
        });

        socket.on("code-output", (data) => {
            setOutput(data.output || data.compileError || data.runtimeError);
        });

        return () => {
            socket.off("connect");
            socket.off("code-update");
            socket.off("code-output");
        };

    }, [roomId]);

    const handleCodeChange = (code) => {
        console.log("Sending code change:", code);
        setCode(code);
        socket.emit("code-change", {
            roomId,
            code: code
        })
    }

    const runCode=async () => {
        try{
            await axios.post(
                "http://localhost:5000/api/run",
                { code, roomId },
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }
        catch(err){
            console.log(err);
        }
    };

    return (
        <div>
            <Navbar />
            <h2>ROOM: {roomId}</h2>
            <CodeEditor code={code} setCode={handleCodeChange} />
            <button onClick={runCode}>Run Code</button>
            <OutputPanel output={output} />
        </div>
    )
}

export default Room;