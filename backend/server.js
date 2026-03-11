require("dotenv").config();
const mongoose=require("mongoose");
const express=require("express");
const http=require("http");
const { Server }=require("socket.io");
const cors=require("cors");
const runRoute=require("./routes/run");
const Room=require("./models/Room");
const authRoutes=require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const jwt=require("jsonwebtoken");

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use(authMiddleware);
app.use("/api/run",runRoute);

const server=http.createServer(app);

const io=new Server(server, {
    cors: {
        origin: "*",
    },
});

app.set("io", io);

io.use((socket,next)=>{
    const token=socket.handshake.auth.token;

    if(!token){
        return next(new Error("Unauthorized"));
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        socket.user=decoded;
        next();
    }
    catch(err){
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => { //key
    console.log("User connected: ",socket.id);

    socket.on("join-room", async ({ roomId,name }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        const room=await Room.findOneAndUpdate(
            { roomId },
            {
                $setOnInsert: {
                    roomId,
                    currentCode: ""
                },
                $addToSet: {
                    participants: {
                        name: name,
                        role: "editor",
                        joinedAt: new Date()
                    }
                }
            },
            { new: true, upsert: true }
        );
        console.log("Room found:", room.roomId);
        console.log("Current code:", room.currentCode);
        socket.emit("code-update", room.currentCode);
    });

    socket.on("code-change", async ({ roomId,code }) => {
        console.log("Code change received from:", socket.id);
        console.log("Room:", roomId);
        await Room.findOneAndUpdate(
            {roomId},
            {currentCode: code, lastActive: new Date() }
        );
        socket.to(roomId).emit("code-update",code);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ",socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
})