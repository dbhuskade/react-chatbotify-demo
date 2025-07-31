import ChatBot from "react-chatbotify";
import { AzureOpenAI } from "openai";

const DEPLOYMENT = import.meta.env.VITE_DEPLOYMENT;
const AZURE_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const VITE_AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;

console.log("Azure API baseugyug------------->:", VITE_AZURE_OPENAI_ENDPOINT);

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const deployment = DEPLOYMENT;
const apiVersion = import.meta.env.VITE_API_VERSION;
const dangerouslyAllowBrowser = true; // for allowing API key in browser
const options = {
  deployment,
  apiVersion,
  endpoint,
  apiKey: AZURE_API_KEY,
  dangerouslyAllowBrowser,
};
const client = new AzureOpenAI(options);

// getChatCompletion();

const BotComponent = () => {
  async function getChatCompletion(userInput: any) {
    try {
      const completion = await client.chat.completions.create({
        model: DEPLOYMENT, // Specify the desired chat model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userInput },
        ],
        // Optional parameters like temperature, max_tokens, etc.
      });
      const response = completion.choices[0].message.content;
      console.log("Chat completion response:", response);
      return response;
    } catch (error) {
      console.error("Error getting chat completion:", error);
    }
  }
  const flow = {
    start: {
      message: "Hello, I am sentient now, talk to me!",
      path: "model_loop",
    },
    model_loop: {
      message: async (params: { userInput: any; }) => {
        const result = await getChatCompletion(params.userInput);
        return result ?? "This is not the answer"; // Ensure always returns a string
      },
      path: "model_loop",
    },
  };
  return (
    <ChatBot flow={flow} />
  );
};

export default BotComponent;
