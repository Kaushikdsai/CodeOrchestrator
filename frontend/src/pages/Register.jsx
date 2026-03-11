import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css"
import Navbar from "../components/Navbar";

function Register(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");

    const navigate=useNavigate();

    const handleSubmit=async (e) => {
        e.preventDefault();
        try{
            await axios.post("http://localhost:5000/api/auth/register", {
                name,email,password
            });
            navigate("/login");
        }
        catch(err){
            console.log(err.response?.data || err);
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h1 className="register-title">REGISTER</h1>
                <input className="register-ip" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="register-ip" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="register-ip" placeholder="Enter password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="register-btn" type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
        </>
    )
}

export default Register;