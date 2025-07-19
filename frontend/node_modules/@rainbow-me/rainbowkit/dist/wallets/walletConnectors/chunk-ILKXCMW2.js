"use client";
import {
  isAndroid
} from "./chunk-ZOLACFTK.js";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/bitgetWallet/bitgetWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var bitgetWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isBitKeepInjected = typeof window !== "undefined" && window.bitkeep !== void 0 && window.bitkeep.ethereum !== void 0 && window.bitkeep.ethereum.isBitKeep === true;
  const shouldUseWalletConnect = !isBitKeepInjected;
  return {
    id: "bitget",
    name: "Bitget Wallet",
    iconUrl: async () => (await import("./bitgetWallet-JVNCB4EB.js")).default,
    iconAccent: "#f6851a",
    iconBackground: "#fff",
    installed: !shouldUseWalletConnect ? isBitKeepInjected : void 0,
    downloadUrls: {
      android: "https://web3.bitget.com/en/wallet-download?type=0",
      ios: "https://apps.apple.com/app/bitkeep/id1395301115",
      mobile: "https://web3.bitget.com/en/wallet-download?type=2",
      qrCode: "https://web3.bitget.com/en/wallet-download",
      chrome: "https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak",
      browserExtension: "https://web3.bitget.com/en/wallet-download"
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        chains,
        options: walletConnectOptions,
        projectId,
        version: walletConnectVersion
      }) : new InjectedConnector({
        chains,
        options: {
          getProvider: () => window.bitkeep.ethereum,
          ...options
        }
      });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return isAndroid() ? uri : `bitkeep://wc?uri=${encodeURIComponent(uri)}`;
      };
      return {
        connector,
        extension: {
          instructions: {
            learnMoreUrl: "https://web3.bitget.com/en/academy",
            steps: [
              {
                description: "wallet_connectors.bitget.extension.step1.description",
                step: "install",
                title: "wallet_connectors.bitget.extension.step1.title"
              },
              {
                description: "wallet_connectors.bitget.extension.step2.description",
                step: "create",
                title: "wallet_connectors.bitget.extension.step2.title"
              },
              {
                description: "wallet_connectors.bitget.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.bitget.extension.step3.description"
              }
            ]
          }
        },
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : void 0
        },
        qrCode: shouldUseWalletConnect ? {
          getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
          instructions: {
            learnMoreUrl: "https://web3.bitget.com/en/academy",
            steps: [
              {
                description: "wallet_connectors.bitget.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.bitget.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.bitget.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.bitget.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.bitget.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.bitget.qr_code.step3.title"
              }
            ]
          }
        } : void 0
      };
    }
  };
};
var bitKeepWallet = bitgetWallet;

export {
  bitgetWallet,
  bitKeepWallet
};
