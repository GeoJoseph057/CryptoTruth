import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import type { WalletConnectConnectorOptions, WalletConnectLegacyConnectorOptions } from '../../getWalletConnectConnector';
export interface OktoWalletLegacyOptions {
    projectId?: string;
    chains: Chain[];
    walletConnectVersion: '1';
    walletConnectOptions?: WalletConnectLegacyConnectorOptions;
}
export interface OktoWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
export declare const oktoWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, }: OktoWalletLegacyOptions | OktoWalletOptions) => Wallet;
