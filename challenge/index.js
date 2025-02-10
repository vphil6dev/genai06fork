import 'dotenv/config';
import OpenAI from 'openai/index.mjs';
import readlineSync from 'readline-sync';

// Open AI configuration
//const kMODEL_ENGINE = "gpt-3.5-turbo-0125";
const kMODEL_ENGINE = "gpt-4o-mini";
const kSYSTEM_ROLE = "You are a funny assistant.";
//const kSYSTEM_ROLE = "You are a helpful assistant.";

const openai = new OpenAI({
  apiKey: process.env.GENAICURSUSKEY,
});

// Get user input
function getInput(promptMessage) {
  return readlineSync.question(promptMessage, {
    hideEchoBack: false, // The typed characters won't be displayed if set to true
  });
}

async function main() {
  console.log('\n\n----------------------------------');
  console.log('          CHAT WITH AI 🤖   ');
  console.log('----------------------------------\n');
  console.log("type 'x' to exit the conversation");
  console.log("MODEL:", kMODEL_ENGINE, " / ROLE:", kSYSTEM_ROLE);
  await runConversation();
}

async function runConversation() {

  const chatPrompts = [
    { role: "system", content: kSYSTEM_ROLE }
  ];

  while (true) {
    const userInput = getInput('You: ');
    if (userInput === 'x') {
      console.log("Goodbye!");
      process.exit();
    }
    chatPrompts.push({
      "role": "user",
      content: userInput
    });
    const completion = await openai.chat.completions.create({
      model: kMODEL_ENGINE,
      messages: chatPrompts
    });
    chatPrompts.push(completion.choices[0].message);
    console.log(completion.choices[0].message);
  }
}

main();
