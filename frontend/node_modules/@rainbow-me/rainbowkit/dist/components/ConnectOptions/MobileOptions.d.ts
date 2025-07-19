import React from 'react';
import { WalletConnector } from '../../wallets/useWalletConnectors';
export declare function WalletButton({ onClose, wallet, connecting, }: {
    wallet: WalletConnector;
    onClose: () => void;
    connecting?: boolean;
}): React.JSX.Element;
export declare function MobileOptions({ onClose }: {
    onClose: () => void;
}): React.JSX.Element;
