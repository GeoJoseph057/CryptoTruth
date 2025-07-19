"use client";
// src/wallets/walletConnectors/desigWallet/desigWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var desigWallet = ({
  chains,
  ...options
}) => {
  var _a;
  return {
    id: "desig",
    name: "Desig Wallet",
    iconUrl: async () => (await import("./desigWallet-YZ4ZDEYW.js")).default,
    iconBackground: "#ffffff",
    installed: typeof window !== "undefined" && !!((_a = window == null ? void 0 : window.desig) == null ? void 0 : _a.ethereum) || void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=io.desig.app",
      ios: "https://apps.apple.com/app/desig-wallet/id6450106028",
      qrCode: "https://desig.io",
      mobile: "https://desig.io",
      browserExtension: "https://chrome.google.com/webstore/detail/desig-wallet/panpgppehdchfphcigocleabcmcgfoca"
    },
    createConnector: () => {
      const getProvider = () => {
        var _a2;
        return typeof window !== "undefined" ? (_a2 = window.desig) == null ? void 0 : _a2.ethereum : void 0;
      };
      const connector = new InjectedConnector({
        chains,
        options: { getProvider, ...options }
      });
      return {
        connector,
        extension: {
          instructions: {
            steps: [
              {
                description: "wallet_connectors.desig.extension.step1.description",
                step: "install",
                title: "wallet_connectors.desig.extension.step1.title"
              },
              {
                description: "wallet_connectors.desig.extension.step2.description",
                step: "create",
                title: "wallet_connectors.desig.extension.step2.title"
              },
              {
                description: "wallet_connectors.desig.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.desig.extension.step3.title"
              }
            ],
            learnMoreUrl: "https://desig.io"
          }
        }
      };
    }
  };
};

export {
  desigWallet
};
