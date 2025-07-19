import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
export interface DesigWalletOptions {
    chains: Chain[];
}
export declare const desigWallet: ({ chains, ...options }: DesigWalletOptions & InjectedConnectorOptions) => Wallet;
