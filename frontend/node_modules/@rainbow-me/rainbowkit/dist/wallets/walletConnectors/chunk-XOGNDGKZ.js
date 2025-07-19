"use client";
// src/wallets/walletConnectors/phantomWallet/phantomWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var phantomWallet = ({
  chains,
  ...options
}) => {
  var _a;
  return {
    id: "phantom",
    name: "Phantom",
    iconUrl: async () => (await import("./phantomWallet-OLG36S4X.js")).default,
    iconBackground: "#9A8AEE",
    installed: typeof window !== "undefined" && !!((_a = window.phantom) == null ? void 0 : _a.ethereum) || void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=app.phantom",
      ios: "https://apps.apple.com/app/phantom-solana-wallet/1598432977",
      mobile: "https://phantom.app/download",
      qrCode: "https://phantom.app/download",
      chrome: "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
      firefox: "https://addons.mozilla.org/firefox/addon/phantom-app/",
      browserExtension: "https://phantom.app/download"
    },
    createConnector: () => {
      const getProvider = () => {
        var _a2;
        return typeof window !== "undefined" ? (_a2 = window.phantom) == null ? void 0 : _a2.ethereum : void 0;
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
                description: "wallet_connectors.phantom.extension.step1.description",
                step: "install",
                title: "wallet_connectors.phantom.extension.step1.title"
              },
              {
                description: "wallet_connectors.phantom.extension.step2.description",
                step: "create",
                title: "wallet_connectors.phantom.extension.step2.title"
              },
              {
                description: "wallet_connectors.phantom.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.phantom.extension.step3.title"
              }
            ],
            learnMoreUrl: "https://help.phantom.app"
          }
        }
      };
    }
  };
};

export {
  phantomWallet
};
