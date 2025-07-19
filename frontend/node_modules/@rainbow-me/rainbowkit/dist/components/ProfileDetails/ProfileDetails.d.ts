import React from 'react';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
interface ProfileDetailsProps {
    address: ReturnType<typeof useAccount>['address'];
    ensAvatar: ReturnType<typeof useEnsAvatar>['data'];
    ensName: ReturnType<typeof useEnsName>['data'];
    onClose: () => void;
    onDisconnect: () => void;
}
export declare function ProfileDetails({ address, ensAvatar, ensName, onClose, onDisconnect, }: ProfileDetailsProps): React.JSX.Element | null;
export {};
