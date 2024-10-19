import OpenAI from "openai";
import { Ollama } from "ollama";

/**
 * Interface representing the configuration for the AI model.
 */
interface Config {
  provider: "openai" | "ollama";
  apiToken?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

const systemPrompt = `You are a frontend developer with 8 years of experience in React. You MUST only output the code in plain text without any formatting (this includes indentation and other formatting). You no longer need to include import React from "react"; at the beginning because bundlers can detect it automatically. Additionally, you do not need to export the code, as it will be used within the same file. The first prompt I will give you is the following:`;

async function generateFromOpenAI(prompt: string, config: Config) {
  const openai = new OpenAI({
    apiKey: config.apiToken,
    baseURL: config.baseUrl,
  });

  const response = await openai.chat.completions.create({
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  });

  return response.choices[0].message.content;
}

async function generateFromOllama(prompt: string, config: Config) {
  const ollama = new Ollama({
    host: config.baseUrl,
  });

  const response = await ollama.chat({
    model: config.model,
    options: {
      temperature: config.temperature,
    },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  return response.message.content;
}

/**
 * Creates a tagged template literal function that generates AI-generated text based on the specified configuration.
 *
 * @param {Config} config - The configuration object that contains provider details, model, and optional settings.
 * @returns {Function} A function that takes a template literal (prompt) and generates a response from the chosen AI provider.
 *
 * The returned function accepts a template literal (strings and values) to construct a prompt, which is sent
 * to either OpenAI or Ollama based on the provided configuration. It sends the prompt to the respective model
 * and returns the generated AI response.
 *
 * @example
 * const config = { provider: "openai", model: "gpt-4o" };
 * const ai = await createConfig(config);
 * const Button = await ai`Create a react component of a button`;
 * function ExampleButton() {
 *   return <Button>Click me</Button>;
 * }
 */
async function createConfig(config: Config) {
  /**
   * This function acts as a tagged template literal processor that generates text based on the constructed prompt.
   *
   * @param {TemplateStringsArray} strings - Array of string literals from the template literal.
   * @param {...any[]} values - Interpolated values in the template literal.
   * @returns {Promise<string>} The AI-generated response from the chosen provider.
   *
   * The function constructs a prompt using the strings and values provided and sends this prompt to the AI provider.
   * Depending on the configuration, it sends the prompt to OpenAI or Ollama and returns the generated response.
   */
  return async function (strings: TemplateStringsArray, ...values: any[]) {
    let prompt = "";

    strings.forEach((string, index) => {
      prompt += string;
      if (index < values.length) {
        prompt += values[index];
      }
    });

    if (config.provider === "openai") {
      return await generateFromOpenAI(prompt, config);
    } else if (config.provider === "ollama") {
      return await generateFromOllama(prompt, config);
    }

    throw new Error("Unsupported provider");
  };
}

export default createConfig;
export type { Config };
