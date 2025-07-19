import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { Wallet } from '../../Wallet';
import { WalletConnectConnectorOptions } from '../../getWalletConnectConnector';
export interface CLVWalletOptions {
    projectId: string;
    chains: Chain[];
    walletConnectVersion?: '2';
    walletConnectOptions?: WalletConnectConnectorOptions;
}
declare global {
    interface Window {
        clover: any;
    }
}
export declare const clvWallet: ({ chains, projectId, walletConnectOptions, walletConnectVersion, }: CLVWalletOptions) => Wallet;
