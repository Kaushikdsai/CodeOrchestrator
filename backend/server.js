require("dotenv").config();
const express=require("express");
const http=require("http");
const { Server }=require("socket.io");
const cors=require("cors");
const runRoute=require("./routes/run");

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/run",runRoute);

const server=http.createServer(app);

const io=new Server(server, {
    cors: {
        origin: "*",
    },
});

const roomCode={};

io.on("connection", (socket) => { //key
    console.log("User connected: ",socket.id);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        if(roomCode[roomId]){
            socket.emit("code-update", roomCode[roomId]);
        }
    });

    socket.on("code-change", ({ roomId,code }) => {
        socket.to(roomId).emit("code-update",code);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ",socket.id);
    });
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
})