import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar";

function Home(){

    const [roomId,setRoomId]=useState("");
    const navigate=useNavigate();

    const createNewRoom = () => {
        const id=Date.now().toString(36) + Math.random().toString(36).substring(2,5);
        navigate(`/room/${id}`);
    }

    const joinRoom = () => {
        if(!roomId){
            return;
        }
        navigate(`/room/${roomId}`)
    }

    return (
        <div>
            <Navbar />
            <h1>CODE ORCHESTARTOR</h1>
            <h2>Collaborate. Compile. Execute.</h2>
            <div>
                <button onClick={createNewRoom}>New Room</button>
                <input placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                <button onClick={joinRoom}>Join</button>
            </div>
        </div>
    )
}

export default Home;