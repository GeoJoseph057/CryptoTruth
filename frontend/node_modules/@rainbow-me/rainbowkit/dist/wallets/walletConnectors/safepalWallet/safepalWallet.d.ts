import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import type { WalletConnectConnectorOptions, WalletConnectLegacyConnectorOptions } from '../../getWalletConnectConnector';
declare global {
    interface Window {
        safepalProvider: Window['ethereum'];
    }
}
export interface SafepalWalletLegacyOptions {
    projectId?: string;
    chains: Chain[];
    walletConnectVersion: '1';
    walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}
export interface SafepalWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
export declare const safepalWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, ...options }: (SafepalWalletLegacyOptions | SafepalWalletOptions) & InjectedConnectorOptions) => Wallet;
