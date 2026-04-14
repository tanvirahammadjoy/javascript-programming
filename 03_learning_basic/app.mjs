// app.mjs
import { createServer } from "node:http";
import { Worker } from "node:worker_threads";

const server = createServer((req, res) => {
  if (req.method === "POST" && req.url === "/upload") {
    let data = [];

    req.on("data", (chunk) => {
      data.push(chunk);
    });

    req.on("end", () => {
      const fileBuffer = Buffer.concat(data);

      // send to worker thread
      const worker = new Worker("./worker.mjs", {
        workerData: fileBuffer,
      });

      worker.on("message", (result) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });

      worker.on("error", (err) => {
        console.error("Worker crashed:", err); // 👈 ADD THIS
        res.writeHead(500);
        res.end("Worker error occurred");
      });
    });
  } else {
    res.writeHead(200);
    res.end("Server Running");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// run with `node app.mjs`