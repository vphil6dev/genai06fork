const OpenAI = require("openai");
var readlineSync = require("readline-sync");
const fs = require("fs");
require("dotenv").config();

const openai = new OpenAI();

const LANGUAGE_MODEL = "gpt-3.5-turbo-1106";
const LANGUAGE_MODEL_GPT4_PREVIEW = "gpt-4-turbo-preview";
const ASSISTANT_NAME = "Customer Support Assistant";
const ASSISTANT_DEFAULT_INSTRUCTIONS =
  "You are a professional assistant";

// Upload File to OpenAI

const uploadFile = async (filepath) =>{
  const file = await openai.files.create({
    file: fs.createReadStream(filepath),
    purpose: "assistants",
  });
  console.log(file)
  console.log("file.id: ", file.id)
  return file
}

// Step 1: Create an Assistant
const createAssistant = async (file_id) => { 
  return await openai.beta.assistants.create({
    name: ASSISTANT_NAME,
    description: ASSISTANT_DEFAULT_INSTRUCTIONS,
    model: LANGUAGE_MODEL,
    tools: [{"type": "retrieval"}],
    file_ids: [file_id]
  });
}


// Step 2: Create a Thread


// Step 3: Add a Message to a Thread


// Step 4: Run the Assistant


// Step 5: Check the Run Status


// Step 6: Retrieve and display the Messages


function getInput(promptMessage) {
  return readlineSync.question(promptMessage, {
    hideEchoBack: false, // The typed characters won't be displayed if set to true
  });
}

async function main() {
  console.log("\n\n----------------------------------");
  console.log("           🤖 AI ASSISTANT           ");
  console.log("---------------------------------- \n ");
  console.log("to exit Chat type 'X'");

  // Step 0: Create a File
  const file = await uploadFile("files/faq_abc.txt")
 
  // Step 1: Create an Assistant
  const assistant = await createAssistant(file.id)
  // Step 2: Create a Thread


  while (true) {
    // Step 3: Add a Message to a Thread
    const userMessage = getInput("You: ");
    if (userMessage.toUpperCase() === "X") {
      console.log("Goodbye!");
      process.exit();
    }

    console.log("userMessage: ", userMessage)


    // Step 4: Run the Assistant

    // Step 5: Check the Run Status

    // Step 6: Retrieve and display the Messages

  }
}

main();
