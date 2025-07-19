"use client";
// src/wallets/walletConnectors/tahoWallet/tahoWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var tahoWallet = ({
  chains,
  ...options
}) => ({
  id: "taho",
  name: "Taho",
  iconBackground: "#d08d57",
  iconUrl: async () => (await import("./tahoWallet-BYONWLHD.js")).default,
  downloadUrls: {
    chrome: "https://chrome.google.com/webstore/detail/taho/eajafomhmkipbjmfmhebemolkcicgfmd",
    browserExtension: "https://taho.xyz"
  },
  installed: typeof window !== "undefined" && typeof window.tally !== "undefined" && window["tally"] ? true : void 0,
  createConnector: () => {
    return {
      connector: new InjectedConnector({
        chains,
        options: {
          getProvider: () => {
            const getTaho = (tally) => (tally == null ? void 0 : tally.isTally) ? tally : void 0;
            if (typeof window === "undefined")
              return;
            return getTaho(window.tally);
          },
          ...options
        }
      }),
      extension: {
        instructions: {
          learnMoreUrl: "https://tahowallet.notion.site/Taho-Knowledge-Base-4d95ed5439c64d6db3d3d27abf1fdae5",
          steps: [
            {
              description: "wallet_connectors.taho.extension.step1.description",
              step: "install",
              title: "wallet_connectors.taho.extension.step1.title"
            },
            {
              description: "wallet_connectors.taho.extension.step2.description",
              step: "create",
              title: "wallet_connectors.taho.extension.step2.title"
            },
            {
              description: "wallet_connectors.taho.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.taho.extension.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  tahoWallet
};
