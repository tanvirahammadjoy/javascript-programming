import readline from "readline";

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const name = await askQuestion("What is your name? ");
  const age = await askQuestion("What is your age? ");
  
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

main();
