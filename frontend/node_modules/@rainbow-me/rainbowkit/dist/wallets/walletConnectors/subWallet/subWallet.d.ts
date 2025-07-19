import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import { WalletConnectConnectorOptions } from '../../getWalletConnectConnector';
declare global {
    interface Window {
        SubWallet: Window['ethereum'];
    }
}
export interface SubWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
export declare const subWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, ...options }: SubWalletOptions & InjectedConnectorOptions) => Wallet;
