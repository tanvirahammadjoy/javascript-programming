// simple-worker.mjs
import { workerData, parentPort } from "node:worker_threads";

if (parentPort) {
  parentPort.postMessage(workerData.toString());
} else {
  console.log("This file should be run as a worker");
}