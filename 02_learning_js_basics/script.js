import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const arr = [];

async function askForNumber() {
  const answer = await rl.question("What do you want to add to your list: ");
  arr.push(answer);
}

for (let i = 0; i < 3; i++) {
  await askForNumber();
}

rl.close();
console.log("Final array:", arr);
