const readline = require('readline');

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function pickAgent(agents) {
  if (agents.length === 1) {
    return agents[0];
  }

  console.log('\nMultiple agent configurations detected in this project:');
  agents.forEach((agent, index) => {
    console.log(`  ${index + 1}. ${agent.label}`);
  });

  while (true) {
    const answer = await ask('\nWhich agent do you want to install Codebase-Compass for? (number): ');
    const choice = parseInt(answer, 10);

    if (!Number.isNaN(choice) && choice >= 1 && choice <= agents.length) {
      return agents[choice - 1];
    }

    console.log(`Invalid choice. Please enter a number between 1 and ${agents.length}.`);
  }
}

module.exports = { ask, pickAgent };
