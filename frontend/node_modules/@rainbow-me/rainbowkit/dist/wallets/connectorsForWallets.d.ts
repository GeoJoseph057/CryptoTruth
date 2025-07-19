import { Connector } from 'wagmi';
import { Wallet, WalletList } from './Wallet';
export declare function connectorsForWallets(walletList: WalletList): () => Connector[];
export declare function connectorsForWallets(wallets: Wallet[]): Connector[];
