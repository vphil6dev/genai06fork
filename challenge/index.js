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

// FONCTION BIDON POUR RETOURNER LES PRÉVISIONS MÉTÉO
function getCurrentWeather(location, unit = "celsius") {
  if (location.toLowerCase().includes("brussels")) {
    return JSON.stringify({ location: "Brussels", temperature: "18", unit: "celsius" });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({ location: "San Francisco", temperature: "72", unit: "fahrenheit" });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({ location: "Paris", temperature: "22", unit: "celsius" });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }
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

  /* const queryMessages = [
    { role: "system", content: kSYSTEM_ROLE }
  ]; */

  // FONCTIONS QUI PEUVENT ÊTRE APPELÉES PAR LE MODÈLE
  const externalTools = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];

  const availableFunctions = {
    get_current_weather: getCurrentWeather,
  };

  while (true) {
    const userInput = getInput('You: ');
    if (userInput === 'x') {
      console.log("Goodbye!");
      process.exit();
    }
    const queryMessages = [
      { role: "system", content: kSYSTEM_ROLE }
    ];

    queryMessages.push({
      "role": "user",
      content: userInput
    });
    const response = await openai.chat.completions.create({
      model: kMODEL_ENGINE,
      messages: queryMessages,
      tools: externalTools
    });
    const responseMessage = response.choices[0].message;
    //queryMessages.push(responseMessage);
    console.log(responseMessage);

    // LE MODÈLE VEUT-IL UTILISER UNE FONCTION EXTERNE ? (OU PLUSIEURS)
    const toolsCalls = responseMessage.tool_calls;
    console.log('External tools call: ', toolsCalls.length > 0);
    console.log(toolsCalls);
    if (toolsCalls) {
      // INCLURE LA REPONSE QUI CONTIENT LES FONCTIONS À APPELER
      queryMessages.push(responseMessage);
      for (const toolCall of toolsCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = functionToCall(
          functionArgs.location,
          functionArgs.unit
        );
        console.log(functionResponse)
        // messages.push({
        //   tool_call_id: toolCall.id,
        //   role: "tool",
        //   name: functionName,
        //   content: functionResponse,
        // }); // extend conversation with function response
      }
    }
  }
}

main();
