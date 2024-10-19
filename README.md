# react-component-gen

A package for creating React components with AI. This is just a joke package, so don't use it in production.

## Installation

```bash
npm install react-component-gen
```

## Usage

```typescript
import createConfig from "react-component-gen";

const config = {
  provider: "openai",
  apiToken: "YOUR_API_TOKEN",
  model: "gpt-4o",
};

const ai = await createConfig(config);

const Button = await ai`Create a react component of a button`;

function ExampleButton() {
  return <Button>Click me</Button>;
}
```

## Configuration

The `createConfig` function accepts an object with the following properties:

- `provider`: The AI provider to use. Can be either `"openai"` or `"ollama"`.
- `apiToken`: The API token for the AI provider. Required for OpenAI.
- `baseUrl`: The base URL for the AI provider. Required for Ollama.
- `model`: The model to use for the AI provider. Required.
- `temperature`: The temperature to use for the AI provider. Optional.
- `maxTokens`: The maximum number of tokens to generate. Optional.

## License

MIT License