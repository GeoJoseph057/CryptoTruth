"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/safepalWallet/safepalWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
function getSafepalWalletInjectedProvider() {
  var _a;
  const isSafePalWallet = (ethereum) => {
    const safepalWallet2 = !!ethereum.isSafePal;
    return safepalWallet2;
  };
  const injectedProviderExist = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  if (!injectedProviderExist) {
    return;
  }
  if (window["safepalProvider"]) {
    return window["safepalProvider"];
  }
  if (isSafePalWallet(window.ethereum)) {
    return window.ethereum;
  }
  if ((_a = window.ethereum) == null ? void 0 : _a.providers) {
    return window.ethereum.providers.find(isSafePalWallet);
  }
}
var safepalWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isSafePalWalletInjected = Boolean(getSafepalWalletInjectedProvider());
  const shouldUseWalletConnect = !isSafePalWalletInjected;
  return {
    id: "safepal",
    name: "SafePal Wallet",
    iconUrl: async () => (await import("./safepalWallet-FDJRNZUU.js")).default,
    installed: isSafePalWalletInjected || void 0,
    iconAccent: "#3375BB",
    iconBackground: "#fff",
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=io.safepal.wallet&referrer=utm_source%3Drainbowkit%26utm_medium%3Ddisplay%26utm_campaign%3Ddownload",
      ios: "https://apps.apple.com/app/apple-store/id1548297139?pt=122504219&ct=rainbowkit&mt=8",
      mobile: "https://www.safepal.com/en/download",
      qrCode: "https://www.safepal.com/en/download",
      chrome: "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
      browserExtension: "https://www.safepal.com/download?product=2"
    },
    createConnector: () => {
      const getUriMobile = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return `safepalwallet://wc?uri=${encodeURIComponent(uri)}`;
      };
      const getUriQR = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return uri;
      };
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        projectId,
        chains,
        version: walletConnectVersion,
        options: walletConnectOptions
      }) : new InjectedConnector({
        chains,
        options: {
          getProvider: getSafepalWalletInjectedProvider,
          ...options
        }
      });
      const mobileConnector = {
        getUri: shouldUseWalletConnect ? getUriMobile : void 0
      };
      let qrConnector = void 0;
      if (shouldUseWalletConnect) {
        qrConnector = {
          getUri: getUriQR,
          instructions: {
            learnMoreUrl: "https://safepal.com/",
            steps: [
              {
                description: "wallet_connectors.safepal.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.safepal.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.safepal.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.safepal.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.safepal.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.safepal.qr_code.step3.title"
              }
            ]
          }
        };
      }
      const extensionConnector = {
        instructions: {
          learnMoreUrl: "https://www.safepal.com/download?product=2",
          steps: [
            {
              description: "wallet_connectors.safepal.extension.step1.description",
              step: "install",
              title: "wallet_connectors.safepal.extension.step1.title"
            },
            {
              description: "wallet_connectors.safepal.extension.step2.description",
              step: "create",
              title: "wallet_connectors.safepal.extension.step2.title"
            },
            {
              description: "wallet_connectors.safepal.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.safepal.extension.step3.title"
            }
          ]
        }
      };
      return {
        connector,
        mobile: mobileConnector,
        qrCode: qrConnector,
        extension: extensionConnector
      };
    }
  };
};

export {
  safepalWallet
};
