const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const executeCode = async (code) => {
  const jobId = uuid();
  const jobPath = path.join(__dirname, "..", "temp", jobId);

  fs.mkdirSync(jobPath, { recursive: true });
  fs.writeFileSync(path.join(jobPath, "Main.java"), code);

  const fixedPath = jobPath.replace(/\\/g, "/");

  const command = `docker run --rm --memory=256m --cpus=0.5 --network none -v ${fixedPath}:/app -w /app eclipse-temurin:17 sh -c "javac Main.java && java Main"`;

  return new Promise((resolve) => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {

      if (error) {
        resolve({
          compileError: stderr,
          runtimeError: "",
          output: ""
        });
      } else {
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