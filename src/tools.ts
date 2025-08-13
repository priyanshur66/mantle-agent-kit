import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Import functions
import { transferMnt } from './tools/mantle/mntOperations.js';
import { transferErc20, burnErc20 } from './tools/mantle/erc20Operations.js';
import { getMntBalance } from './tools/mantle/getMntBalance.js';
import { getErc20Balance } from './tools/mantle/getErc20Balance.js';
import { deployContract } from './tools/mantle/deployContract.js';
import { setCurrentPrivateKey } from './core/client.js';

// Types
type MantleAgentInterface = {
  getCredentials: () => { privateKey: string };
};

/**
 * Wraps a function to inject the private key from the agent
 * @param fn - The function to wrap
 * @param agent - The MantleAgent instance containing credentials
 */
const withPrivateKey = <T>(
  fn: (params: T) => Promise<any>,
  agent: MantleAgentInterface,
) => {
  return (params: T) => {
    // Set the private key in the client before calling the function
    const credentials = agent.getCredentials();
    setCurrentPrivateKey(credentials.privateKey);
    return fn(params);
  };
};

// Schema definitions
const transferMntSchema = z.object({
  toAddress: z.string().describe('The wallet address to transfer MNT to'),
  amount: z.string().describe('The amount of MNT to transfer'),
});

const transferErc20Schema = z.object({
  tokenAddress: z.string().describe('The ERC20 token contract address'),
  toAddress: z.string().describe('The wallet address to transfer tokens to'),
  amount: z.string().describe('The amount of tokens to transfer'),
});

const burnErc20Schema = z.object({
  tokenAddress: z.string().describe('The ERC20 token contract address'),
  amount: z.string().describe('The amount of tokens to burn'),
});

const getMntBalanceSchema = z.object({
  walletAddress: z.string().nullable().optional().describe('The wallet address to check MNT balance (optional, uses agent wallet if not provided)'),
});

const getErc20BalanceSchema = z.object({
  tokenAddress: z.string().describe('The ERC20 token contract address'),
  walletAddress: z.string().nullable().optional().describe('The wallet address to check balance (optional, uses agent wallet if not provided)'),
});

const deployContractSchema = z.object({
  abi: z.array(z.record(z.any())).describe('The contract ABI as an array of objects'),
  bytecode: z.string().describe('The contract bytecode'),
  args: z.array(z.union([z.string(), z.number(), z.boolean()])).nullable().optional().describe('Constructor arguments (optional)'),
});

/**
 * Creates and returns all tools with injected agent credentials
 */
export const createTools = (agent: MantleAgentInterface) => [
  tool(withPrivateKey(transferMnt, agent), {
    name: 'transfer_mnt',
    description: 'Transfer MNT (native Mantle token) to another wallet',
    schema: transferMntSchema,
  }),

  tool(withPrivateKey(transferErc20, agent), {
    name: 'transfer_erc20',
    description: 'Transfer ERC20 tokens to another wallet',
    schema: transferErc20Schema,
  }),

  tool(withPrivateKey(burnErc20, agent), {
    name: 'burn_erc20',
    description: 'Burn ERC20 tokens (send to burn address)',
    schema: burnErc20Schema,
  }),

  tool(withPrivateKey(getMntBalance, agent), {
    name: 'get_mnt_balance',
    description: 'Get MNT balance of a wallet',
    schema: getMntBalanceSchema,
  }),

  tool(withPrivateKey(getErc20Balance, agent), {
    name: 'get_erc20_balance',
    description: 'Get ERC20 token balance of a wallet',
    schema: getErc20BalanceSchema,
  }),

  tool(withPrivateKey(deployContract, agent), {
    name: 'deploy_contract',
    description: 'Deploy a smart contract to Mantle network',
    schema: deployContractSchema,
  }),
];
