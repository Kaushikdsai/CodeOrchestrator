const { exec }=require("child_process");
const fs=require("fs");
const path=require("path");
const { v4: uuid }=require("uuid");

const executeCode=async (code, language) => {
    const jobId=uuid();
    const jobPath=path.join(__dirname, "..", "temp", jobId);

    fs.mkdirSync(jobPath, { recursive: true });

    let filename;
    let command;

    const fixedPath=jobPath.replace(/\\/g, "/");

    if(language==="java"){
        filename="Main.java";
        fs.writeFileSync(path.join(jobPath, filename), code);
        command=`docker run --rm --memory=256m --cpus=0.5 --network none -v ${fixedPath}:/app -w /app eclipse-temurin:17 sh -c "javac Main.java && java Main"`;
    }

    else if(language==="javascript"){
        filename="main.js";
        fs.writeFileSync(path.join(jobPath, filename), code);
        command=`docker run --rm --memory=256m --cpus=0.5 --network none -v ${fixedPath}:/app -w /app node:18 node main.js`;
    }

    else if(language==="python"){
        filename="main.py";
        fs.writeFileSync(path.join(jobPath, filename), code);
        command=`docker run --rm --memory=256m --cpus=0.5 --network none -v ${fixedPath}:/app -w /app python:3.11 python main.py`;
    }

    else if(language==="cpp"){
        filename="main.cpp";
        fs.writeFileSync(path.join(jobPath, filename), code);
        command=`docker run --rm --memory=256m --cpus=0.5 --network none -v ${fixedPath}:/app -w /app gcc:12 sh -c "g++ main.cpp -o main && ./main"`;
    }

    return new Promise((resolve) => {
        exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
            if(error){
                  resolve({
                    compileError: stderr,
                    runtimeError: "",
                    output: ""
                  });
            }
            else{
                resolve({
                    compileError: "",
                    runtimeError: "",
                    output: stdout
                });
            }
            fs.rmSync(jobPath, { recursive: true, force: true });
        });
    });
};

module.exports = { executeCode };