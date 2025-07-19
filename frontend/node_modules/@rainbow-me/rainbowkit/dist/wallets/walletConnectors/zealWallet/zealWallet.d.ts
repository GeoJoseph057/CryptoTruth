import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
export interface ZealWalletOptions {
    chains: Chain[];
}
export declare const zealWallet: ({ chains, ...options }: ZealWalletOptions & InjectedConnectorOptions) => Wallet;
