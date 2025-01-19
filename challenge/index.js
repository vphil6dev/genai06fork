require('dotenv').config();
const OpenAI = require('openai');
const readlineSync = require('readline-sync');

// Open AI configuration
const openai = new OpenAI({
  apiKey: "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",
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

  let messages = [{ role: "system", content: "You are a funny assistant." }];
  //let messages = [{ role: "system", content: "You are a helpful assistant." }];

  while (true) {
    const input = getInput('You: ');
    if (input === 'x') {
      console.log("Goodbye!");
      process.exit();
    }
    messages.push({"role": "user", "content": input});
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    console.log(completion.choices[0].message.content);
    // messages.push(completion.choices[0].message.content);
  }
}

main();
