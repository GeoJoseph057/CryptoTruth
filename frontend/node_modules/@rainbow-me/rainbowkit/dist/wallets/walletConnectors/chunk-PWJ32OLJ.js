"use client";
// src/wallets/walletConnectors/frameWallet/frameWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var frameWallet = ({
  chains,
  ...options
}) => {
  var _a;
  return {
    id: "frame",
    name: "Frame",
    installed: typeof window !== "undefined" && typeof window.ethereum !== "undefined" && (window.ethereum.isFrame === true || !!((_a = window.ethereum.providers) == null ? void 0 : _a.find((p) => p.isFrame === true))),
    iconUrl: async () => (await import("./frameWallet-J2WUL2NQ.js")).default,
    iconBackground: "#121C20",
    downloadUrls: {
      browserExtension: "https://frame.sh/"
    },
    createConnector: () => ({
      connector: new InjectedConnector({
        chains,
        options
      }),
      extension: {
        instructions: {
          learnMoreUrl: "https://docs.frame.sh/docs/Getting%20Started/Installation/",
          steps: [
            {
              description: "wallet_connectors.frame.extension.step1.description",
              step: "install",
              title: "wallet_connectors.frame.extension.step1.title"
            },
            {
              description: "wallet_connectors.frame.extension.step2.description",
              step: "create",
              title: "wallet_connectors.frame.extension.step2.title"
            },
            {
              description: "wallet_connectors.frame.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.frame.extension.step3.title"
            }
          ]
        }
      }
    })
  };
};

export {
  frameWallet
};
