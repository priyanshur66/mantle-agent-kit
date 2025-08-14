import { createTestAgent, type MantleAgentType } from './setup.js';
import { config } from 'dotenv';

// Load environment variables
config();

let agent: MantleAgentType;

const beforeEach = () => {
  agent = createTestAgent({
    privateKey: process.env.PRIVATE_KEY,
    rpcUrl: process.env.MANTLE_RPC_URL,
    openAiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });
};

const test = async (name: string, testFn: () => Promise<void>) => {
  console.log(`\n🧪 Running test: ${name}`);
  try {
    beforeEach();
    await testFn();
    console.log(`✅ Test passed: ${name}`);
  } catch (error) {
    console.error(`❌ Test failed: ${name}`, error);
  }
};

// Test MNT balance
await test('get MNT balance', async () => {
  const balance = await agent.getMntBalance();
  console.log('MNT Balance:', balance);
});

// Test MNT balance via natural language
await test('get MNT balance via natural language', async () => {
  const result = await agent.execute('Get my MNT balance');
  console.log('Agent response:', result);
});

// Test getting balance of specific wallet
await test('get balance of specific wallet', async () => {
  const result = await agent.execute(
    'how much 0xE7E314eFB5E598A1C28F0b10329242bE90BF0985 do you have' // pass address of any erc20 token 
  );
  console.log('Agent response:', result);
});
