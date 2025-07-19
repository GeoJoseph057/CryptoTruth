"use client";
// src/wallets/walletConnectors/safeheronWallet/safeheronWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var safeheronWallet = ({
  chains,
  ...options
}) => ({
  id: "safeheron",
  name: "Safeheron",
  installed: typeof window !== "undefined" && typeof window.safeheron !== "undefined" && window.safeheron.isSafeheron === true,
  iconUrl: async () => (await import("./safeheronWallet-YBMFXEUH.js")).default,
  iconBackground: "#fff",
  downloadUrls: {
    chrome: "https://chrome.google.com/webstore/detail/safeheron/aiaghdjafpiofpainifbgfgjfpclngoh",
    browserExtension: "https://www.safeheron.com/"
  },
  createConnector: () => ({
    connector: new InjectedConnector({
      chains,
      options: {
        getProvider: () => typeof window !== "undefined" ? window.safeheron : void 0,
        ...options
      }
    }),
    extension: {
      instructions: {
        learnMoreUrl: "https://www.safeheron.com/",
        steps: [
          {
            description: "wallet_connectors.safeheron.extension.step1.description",
            step: "install",
            title: "wallet_connectors.safeheron.extension.step1.title"
          },
          {
            description: "wallet_connectors.safeheron.extension.step2.description",
            step: "create",
            title: "wallet_connectors.safeheron.extension.step2.title"
          },
          {
            description: "wallet_connectors.safeheron.extension.step3.description",
            step: "refresh",
            title: "wallet_connectors.safeheron.extension.step3.title"
          }
        ]
      }
    }
  })
});

export {
  safeheronWallet
};
