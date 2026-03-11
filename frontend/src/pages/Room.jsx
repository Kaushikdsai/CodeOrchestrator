import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import CodeEditor from "../components/Editor";
import OutputPanel from "../components/OutputPanel";
import { socket } from "../services/socket";
import Navbar from "../components/Navbar";
import "../styles/Room.css";

function Room(){
    
    const { roomId }=useParams();

    const [code,setCode]=useState("");
    const [output,setOutput]=useState("");
    const [participants,setParticipants]=useState([]);

    const token=sessionStorage.getItem("token");

    useEffect(() => {
        const token=sessionStorage.getItem("token");
        socket.auth={ token };
        if(!socket.connected){
            socket.connect();
        }

        const joinRoom = async () => {
            console.log("Joining room:", roomId);
            const res=await axios.get(`http://localhost:5000/api/auth/profile`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const name=res.data;
            socket.emit("join-room", { roomId,name });
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

        socket.on("participants-update", (participants) => {
            setParticipants(participants);
        });

        socket.on("code-output", (data) => {
            setOutput(data.output || data.compileError || data.runtimeError);
        });

        return () => {
            socket.off("connect");
            socket.off("code-update");
            socket.off("code-output");
            socket.off("participants-update");
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
            <h2 className="room-title">ROOM: {roomId}</h2>
            <CodeEditor code={code} setCode={handleCodeChange} />
            <button className="run-btn" onClick={runCode}>Run Code</button>
            <OutputPanel output={output} />
            <div className="participants">
                <h3>Active participants</h3>
                {participants.map((p) => (
                    <div key={p.socketId}>{p.name}</div>
                ))}
            </div>
        </div>
    )
}

export default Room;