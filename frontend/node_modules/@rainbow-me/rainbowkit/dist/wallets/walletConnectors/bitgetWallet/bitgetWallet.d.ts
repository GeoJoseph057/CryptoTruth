import type { InjectedConnectorOptions } from '@wagmi/core/connectors/injected';
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import type { WalletConnectConnectorOptions, WalletConnectLegacyConnectorOptions } from '../../getWalletConnectConnector';
export interface BitgetWalletLegacyOptions {
    projectId?: string;
    chains: Chain[];
    walletConnectVersion: '1';
    walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}
export interface BitgetWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
/**
 * @deprecated `BitKeepWalletLegacyOptions` is now `BitgetWalletLegacyOptions`
 */
export interface BitKeepWalletLegacyOptions {
    projectId?: string;
    chains: Chain[];
    walletConnectVersion: '1';
    walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}
/**
 * @deprecated `BitKeepWalletOptions` is now `BitgetWalletOptions`
 */
export interface BitKeepWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
export declare const bitgetWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, ...options }: (BitgetWalletLegacyOptions | BitgetWalletOptions | BitKeepWalletLegacyOptions | BitKeepWalletOptions) & InjectedConnectorOptions) => Wallet;
/**
 * @deprecated `bitKeepWallet` is now `bitgetWallet`
 */
export declare const bitKeepWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, ...options }: (BitgetWalletLegacyOptions | BitgetWalletOptions | BitKeepWalletLegacyOptions | BitKeepWalletOptions) & InjectedConnectorOptions) => Wallet;
