"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";
import {
  isIOS
} from "./chunk-ZOLACFTK.js";

// src/wallets/walletConnectors/zerionWallet/zerionWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var zerionWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isZerionInjected = typeof window !== "undefined" && (typeof window.ethereum !== "undefined" && window.ethereum.isZerion || typeof window.zerionWallet !== "undefined");
  const shouldUseWalletConnect = !isZerionInjected;
  return {
    id: "zerion",
    name: "Zerion",
    iconUrl: async () => (await import("./zerionWallet-35GMAYN4.js")).default,
    iconAccent: "#2962ef",
    iconBackground: "#2962ef",
    installed: !shouldUseWalletConnect ? isZerionInjected : void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=io.zerion.android",
      ios: "https://apps.apple.com/app/apple-store/id1456732565",
      mobile: "https://link.zerion.io/pt3gdRP0njb",
      qrCode: "https://link.zerion.io/pt3gdRP0njb",
      chrome: "https://chrome.google.com/webstore/detail/klghhnkeealcohjjanjjdaeeggmfmlpl",
      browserExtension: "https://zerion.io/extension"
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        projectId,
        chains,
        version: walletConnectVersion,
        options: walletConnectOptions
      }) : new InjectedConnector({
        chains,
        options: {
          getProvider: () => typeof window !== "undefined" ? window.zerionWallet || window.ethereum : void 0,
          ...options
        }
      });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return isIOS() ? `zerion://wc?uri=${encodeURIComponent(uri)}` : uri;
      };
      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : void 0
        },
        qrCode: shouldUseWalletConnect ? {
          getUri,
          instructions: {
            learnMoreUrl: "https://zerion.io/blog/announcing-the-zerion-smart-wallet/",
            steps: [
              {
                description: "wallet_connectors.zerion.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.zerion.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.zerion.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.zerion.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.zerion.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.zerion.qr_code.step3.title"
              }
            ]
          }
        } : void 0,
        extension: {
          instructions: {
            learnMoreUrl: "https://help.zerion.io/en/",
            steps: [
              {
                description: "wallet_connectors.zerion.extension.step1.description",
                step: "install",
                title: "wallet_connectors.zerion.extension.step1.title"
              },
              {
                description: "wallet_connectors.zerion.extension.step2.description",
                step: "create",
                title: "wallet_connectors.zerion.extension.step2.title"
              },
              {
                description: "wallet_connectors.zerion.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.zerion.extension.step3.title"
              }
            ]
          }
        }
      };
    }
  };
};

export {
  zerionWallet
};
