import { MantleAgent, type MantleAgentConfig } from '../src/MantleAgent.js';

export type MantleAgentType = MantleAgent;


export const createTestAgent = (config?: Partial<MantleAgentConfig>): MantleAgent => {
  if (!config?.privateKey) {
    throw new Error('privateKey is required in config');
  }

  const defaultConfig: MantleAgentConfig = {
    privateKey: config.privateKey,
    rpcUrl: config?.rpcUrl || 'https://rpc.sepolia.mantle.xyz',
    model: config?.model || 'gpt-4o-mini',
    openAiApiKey: config?.openAiApiKey,
    anthropicApiKey: config?.anthropicApiKey,
  };

  return new MantleAgent(defaultConfig);
};


