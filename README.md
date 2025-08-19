# Mantle Agent Kit

An AI agent SDK for the Mantle blockchain that enables interaction with Mantle network through natural language prompts
## Features

- 🤖 **AI-Powered Blockchain Interactions**: Execute blockchain operations using natural language prompts
- 🔒 **Built-in Security**: AI firewall protection against malicious prompts and llm jailbreaks
- 💰 **MNT Operations**: Transfer MNT tokens and check balances
- 🪙 **ERC-20 Support**: Transfer, burn, and check balances of ERC-20 tokens
- 🌐 **Multiple AI Models**: Support for OpenAI and Anthropic models
- 🛡️ **Security-First**: Pattern matching and LLM-based sanitization to protect sensitive operations

## Installation

```bash
npm install mantle-agent-kit
```

## Quick Start

### Basic Setup

```typescript
import { MantleAgent } from 'mantle-agent-kit';

const agent = new MantleAgent({
  privateKey: 'your-private-key',
  rpcUrl: 'https://rpc.mantle.xyz', // Mantle mainnet or testnet RPC
  model: 'gpt-4', // or 'claude-3-sonnet'
  openAiApiKey: 'your-openai-api-key', // Required for OpenAI models
  anthropicApiKey: 'your-anthropic-api-key' // Required for Anthropic models
});
```

### Natural Language Execution

```typescript
// Execute blockchain operations using natural language
const response = await agent.execute(
  "Transfer 0.1 MNT to 0x742d35Cc6b8C9532E78c12A5C3295c2d6F1A8F3e"
);

console.log(response.output);
```

### Conversation Memory (Sessions)

The agent maintains per-session conversational memory using LangChain's RunnableWithMessageHistory. Your prompt template already includes `{chat_history}`, so prior messages in a session are automatically provided to the model and updated after each turn.

Key points:
- Memory is keyed by `sessionId` you pass to `execute`.
- If you don't pass a `sessionId`, the agent uses a default per-instance session ID generated at construction.
- Memory is in-process (not persisted across restarts) and isolated per MantleAgent instance.

Basic usage with the default session:

```ts
// Uses the agent's default session (auto-generated). Subsequent calls share memory.
await agent.execute('My name is Pri. Please remember it.');
const r = await agent.execute('What is my name?');
console.log(r.output); // Likely references "Pri"
```

Per-user sessions (recommended for multi-user apps):

```ts
const sessionId = `user:${userId}`;
await agent.execute('Store my preferred token as MNT.', { sessionId });
const res = await agent.execute('What is my preferred token?', { sessionId });
console.log(res.output); // Should recall "MNT"
```

Isolated sessions example:

```ts
await agent.execute('Remember: my color is blue.', { sessionId: 'A' });
const a = await agent.execute('What is my color?', { sessionId: 'A' }); // blue
const b = await agent.execute('What is my color?', { sessionId: 'B' }); // unknown
console.log(a.output, b.output);
```

Resetting memory:
- Start using a new `sessionId`, or
- Create a new MantleAgent instance.

Persistence options:
- By default, memory uses an in-process Map and `InMemoryChatMessageHistory`.
- To persist across restarts or scale horizontally, replace it with a store like Redis by swapping the message history implementation.

## API Reference

### MantleAgent Class

#### Constructor

```typescript
new MantleAgent(config: MantleAgentConfig)
```

**Parameters:**
- `config.privateKey` (string): Wallet private key for blockchain operations
- `config.rpcUrl` (string): Mantle network RPC URL
- `config.model` (string): AI model to use ('gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', etc.)
- `config.openAiApiKey` (string, optional): OpenAI API key (required for OpenAI models)
- `config.anthropicApiKey` (string, optional): Anthropic API key (required for Anthropic models)

#### Methods

##### `execute(input: string, options?: { sessionId?: string })`
Execute blockchain operations using natural language commands.

**Parameters:**
- `input` (string): Natural language command
- `options.sessionId` (string, optional): Identifier for a conversation session. When provided, memory is scoped to this ID. When omitted, a default per-agent session is used.

**Returns:**
- An object containing `input`, `chat_history`, and `output`.


## Security Features

### AI Firewall

The SDK includes built-in security features to protect against malicious inputs and llm jailbreaks:

1. **Pattern Matching**: Detects and blocks prompts that might request private keys or sensitive information
2. **LLM Sanitization**: Uses AI models to analyze and sanitize prompts before execution
3. **Automatic Protection**: All natural language inputs are automatically processed through the firewall

### Best Practices

- Never include private keys in plain text in your code
- Use environment variables for sensitive configuration
- Test operations on testnet before mainnet deployment
- Validate all user inputs before processing

## Environment Setup

Create a `.env` file in your project root:

```env
PRIVATE_KEY=your-wallet-private-key
MANTLE_RPC_URL=https://rpc.mantle.xyz
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Network Configuration

### Mainnet
```
RPC URL: https://rpc.mantle.xyz

```

### Testnet (Mantle Sepolia)
```
RPC URL: https://rpc.sepolia.mantle.xyz

```

## Examples

### Example 1: Basic Token Operations

```typescript
import { MantleAgent } from 'mantle-agent-kit';
import { config } from 'dotenv';

config(); // Load environment variables

const agent = new MantleAgent({
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.MANTLE_RPC_URL!,
  model: 'gpt-4',
  openAiApiKey: process.env.OPENAI_API_KEY
});

async function main() {

  // Transfer tokens using natural language
  const result = await agent.execute(
    "Send 0.01 MNT to address 0x742d35Cc6b8C9532E78c12A5C3295c2d6F1A8F3e"
  );
  console.log(result.output);
}

main().catch(console.error);
```




## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
