import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/login.css"

function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    const handleSubmit=async (e) => {
        e.preventDefault();
        try{
            const res=await axios.post("http://localhost:5000/api/auth/login", {
                email,password
            });
            const data=res.data;
            sessionStorage.setItem("token",data.token);
            console.log(data.token);
            navigate("/home");
        }
        catch(err){
            console.log(err.response?.data || err);
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h1 className="login-title">LOGIN</h1>
                <input className="login-ip" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="login-ip" placeholder="Enter password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="login-btn" type="submit">Submit</button>
                <a href="/register">Create Account</a>
            </form>
        </>
    )
}

export default Login;