"use client";
// src/wallets/walletConnectors/bitskiWallet/bitskiWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var bitskiWallet = ({
  chains,
  ...options
}) => {
  var _a;
  return {
    id: "bitski",
    name: "Bitski",
    installed: typeof window !== "undefined" && typeof window.ethereum !== "undefined" && (window.ethereum.isBitski === true || !!((_a = window.ethereum.providers) == null ? void 0 : _a.find((p) => p.isBitski === true))),
    iconUrl: async () => (await import("./bitskiWallet-Y4QTLQPQ.js")).default,
    iconBackground: "#fff",
    downloadUrls: {
      chrome: "https://chrome.google.com/webstore/detail/bitski/feejiigddaafeojfddjjlmfkabimkell",
      browserExtension: "https://bitski.com"
    },
    createConnector: () => ({
      connector: new InjectedConnector({
        chains,
        options
      }),
      extension: {
        instructions: {
          learnMoreUrl: "https://bitski.zendesk.com/hc/articles/12803972818836-How-to-install-the-Bitski-browser-extension",
          steps: [
            {
              description: "wallet_connectors.bitski.extension.step1.description",
              step: "install",
              title: "wallet_connectors.bitski.extension.step1.title"
            },
            {
              description: "wallet_connectors.bitski.extension.step2.description",
              step: "create",
              title: "wallet_connectors.bitski.extension.step2.title"
            },
            {
              description: "wallet_connectors.bitski.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.bitski.extension.step3.title"
            }
          ]
        }
      }
    })
  };
};

export {
  bitskiWallet
};
