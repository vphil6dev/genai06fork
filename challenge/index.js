import 'dotenv/config';
import OpenAI from 'openai/index.mjs';
import readlineSync from 'readline-sync';

// Open AI configuration
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
  await runConversation();
}

async function runConversation() {

  //let messages = [{ role: "system", content: "You are a funny assistant." }];
  //let messages = [{ role: "system", content: "You are a helpful assistant." }];
  const chatPrompts = [
    { role: "system", content: "You are a helpful assistant." }
  ];

  while (true) {
    const userInput = getInput('You: ');
    if (userInput === 'x') {
      console.log("Goodbye!");
      process.exit();
    }

    // EXAMPLE PROVENANT DE L'EXERCICE PRÉCÉDENT
    /* messages.push({ "role": "user", "content": input });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    console.log(completion.choices[0].message.content);
    // messages.push(completion.choices[0].message.content); */

    // EXAMPLE PROVENANT DU SITE OPENAI
    /* const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write a haiku about recursion in programming.",
        },
      ],
      store: true,
    });
    console.log(completion.choices[0].message); */

    chatPrompts.push({
      "role": "user",
      content: userInput
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatPrompts
    });
    chatPrompts.push(completion.choices[0].message);
    console.log(completion.choices[0].message);
  }
}

main();
