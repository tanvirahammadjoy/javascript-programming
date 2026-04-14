// main.mjs
import { Worker } from "node:worker_threads";

const worker = new Worker("./simple-worker.mjs", {
  workerData: 123,
});

worker.on("message", (msg) => {
  console.log("From worker:", msg);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("exit", (code) => {
  console.log("Worker exited with code:", code);
});
