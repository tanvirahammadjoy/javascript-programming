// test.mjs
import test from "node:test";
import assert from "node:assert";
import { Worker } from "node:worker_threads";

test("worker processes file correctly", async () => {
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker("./worker.mjs", {
      workerData: Buffer.from("hello world"),
    });

    worker.on("message", resolve);
    worker.on("error", reject);
  });

  assert.ok(result.hash);
});
