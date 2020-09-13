import { Deployments } from './deployments';
import { ChainId } from '@uniswap/sdk';

export type Configuration = {
  chainId: number,
  defaultProvider: string,
  deployments: Deployments,
  externalTokens: {[contractName: string]: string};
  config?: EthereumConfig,
  uniswapConfig?: UniswapConfig,
};

export type EthereumConfig = {
  testing: boolean,
  autoGasMultiplier: number,
  defaultConfirmations: number,
  defaultGas: string,
  defaultGasPrice: string,
  ethereumNodeTimeout: number,
};

type UniswapConfig = {
  // Web3 provider used for fetching price feeds.
  provider: string;

  daiAddress: string;
  chainId: ChainId;
  isMockedPrice?: boolean;
}

export const defaultEthereumConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: "6000000",
  defaultGasPrice: "1000000000000",
  ethereumNodeTimeout: 10000,
};