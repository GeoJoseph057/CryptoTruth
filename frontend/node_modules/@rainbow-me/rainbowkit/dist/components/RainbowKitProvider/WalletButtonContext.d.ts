import React, { ReactNode } from 'react';
import { WalletConnector } from '../../wallets/useWalletConnectors';
interface WalletButtonContextValue {
    connector: WalletConnector | null;
    setConnector: (wallet: WalletConnector | null) => void;
}
export declare const WalletButtonContext: React.Context<WalletButtonContextValue>;
interface WalletButtonProviderProps {
    children: ReactNode;
}
export declare function WalletButtonProvider({ children }: WalletButtonProviderProps): React.JSX.Element;
export {};
