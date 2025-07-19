import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
export interface TokenaryWalletOptions {
    chains: Chain[];
}
export declare const tokenaryWallet: ({ chains, ...options }: TokenaryWalletOptions & InjectedConnectorOptions) => Wallet;
