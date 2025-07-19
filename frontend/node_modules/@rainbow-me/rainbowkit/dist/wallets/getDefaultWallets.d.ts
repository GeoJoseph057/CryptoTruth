import type { Connector } from 'wagmi';
import type { Chain } from '../components/RainbowKitProvider/RainbowKitChainContext';
import type { WalletList } from './Wallet';
export declare const getDefaultWallets: ({ appName, chains, projectId, }: {
    appName: string;
    projectId: string;
    chains: Chain[];
}) => {
    connectors: () => Connector[];
    wallets: WalletList;
};
