const express=require("express");
const router=express.Router();
const {executeCode}=require("../services/executionService");
const authMiddleware=require("../middleware/authMiddleware");

router.post("/",authMiddleware,async(req,res) => {
    try{
        const { code,roomId }=req.body;
        const io=req.app.get("io");
        const result=await executeCode(code);
        io.to(roomId).emit("code-output",result);
        res.json(result);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: "Execution failed" });
    }
});


module.exports=router;