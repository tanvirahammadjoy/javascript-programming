// worker.mjs
import { workerData, parentPort } from "node:worker_threads";
import { createHash } from "node:crypto";
import { writeFileSync, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createGzip } from "node:zlib";

async function processFile() {
  // 🔥 Convert to real Buffer
  const buffer = Buffer.from(workerData);

  // ✅ Hash
  const hash = createHash("sha256").update(buffer).digest("hex");

  // ✅ Save original file
  writeFileSync("uploaded.txt", buffer);

  // ✅ Stream correctly (WHOLE buffer, not iterable numbers)
  await pipeline(
    Readable.from([buffer]), // 👈 KEY FIX
    createGzip(),
    createWriteStream("uploaded.txt.gz"),
  );

  parentPort.postMessage({
    message: "File processed",
    hash,
  });
}

processFile().catch((err) => {
  console.error(err);
  parentPort.postMessage({ error: err.message });
});
