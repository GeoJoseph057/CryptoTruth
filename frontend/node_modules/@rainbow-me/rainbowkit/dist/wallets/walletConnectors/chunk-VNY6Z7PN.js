"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/coreWallet/coreWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
function getCoreWalletInjectedProvider() {
  var _a, _b;
  const injectedProviderExist = typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  if (!injectedProviderExist) {
    return;
  }
  if ((_a = window["evmproviders"]) == null ? void 0 : _a["core"]) {
    return (_b = window["evmproviders"]) == null ? void 0 : _b["core"];
  }
  if (window.avalanche) {
    return window.avalanche;
  }
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && window.ethereum.isAvalanche === true) {
    return window.ethereum;
  }
}
var coreWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isCoreInjected = Boolean(getCoreWalletInjectedProvider());
  const shouldUseWalletConnect = !isCoreInjected;
  return {
    id: "core",
    name: "Core",
    iconUrl: async () => (await import("./coreWallet-HRVLR2XS.js")).default,
    iconBackground: "#1A1A1C",
    installed: !shouldUseWalletConnect ? isCoreInjected : void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=com.avaxwallet",
      ios: "https://apps.apple.com/us/app/core-wallet/id6443685999",
      mobile: "https://core.app/?downloadCoreMobile=1",
      qrCode: "https://core.app/?downloadCoreMobile=1",
      chrome: "https://chrome.google.com/webstore/detail/core-crypto-wallet-nft-ex/agoakfejjabomempkjlepdflaleeobhb",
      browserExtension: "https://extension.core.app/"
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        projectId,
        chains,
        options: walletConnectOptions,
        version: walletConnectVersion
      }) : new InjectedConnector({
        chains,
        options: {
          getProvider: getCoreWalletInjectedProvider,
          ...options
        }
      });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return uri;
      };
      return {
        connector,
        mobile: { getUri: shouldUseWalletConnect ? getUri : void 0 },
        qrCode: shouldUseWalletConnect ? {
          getUri,
          instructions: {
            learnMoreUrl: "https://support.avax.network/en/articles/6115608-core-mobile-how-to-add-the-core-mobile-to-my-phone",
            steps: [
              {
                description: "wallet_connectors.core.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.core.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.core.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.core.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.core.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.core.qr_code.step3.title"
              }
            ]
          }
        } : void 0,
        extension: {
          instructions: {
            learnMoreUrl: "https://extension.core.app/",
            steps: [
              {
                description: "wallet_connectors.core.extension.step1.description",
                step: "install",
                title: "wallet_connectors.core.extension.step1.title"
              },
              {
                description: "wallet_connectors.core.extension.step2.description",
                step: "create",
                title: "wallet_connectors.core.extension.step2.title"
              },
              {
                description: "wallet_connectors.core.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.core.extension.step3.title"
              }
            ]
          }
        }
      };
    }
  };
};

export {
  coreWallet
};
