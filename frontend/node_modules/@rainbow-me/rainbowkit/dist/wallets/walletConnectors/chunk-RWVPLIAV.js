"use client";
// src/wallets/walletConnectors/xdefiWallet/xdefiWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var xdefiWallet = ({
  chains,
  ...options
}) => {
  const isInstalled = typeof window !== "undefined" && typeof (window == null ? void 0 : window.xfi) !== "undefined";
  return {
    id: "xdefi",
    name: "XDEFI Wallet",
    installed: isInstalled,
    iconUrl: async () => (await import("./xdefiWallet-QL7LCYNI.js")).default,
    iconBackground: "#fff",
    downloadUrls: {
      chrome: "https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf",
      browserExtension: "https://xdefi.io"
    },
    createConnector: () => ({
      connector: new InjectedConnector({
        chains,
        options: {
          getProvider: () => {
            var _a;
            return isInstalled ? (_a = window.xfi) == null ? void 0 : _a.ethereum : void 0;
          },
          ...options
        }
      }),
      extension: {
        instructions: {
          learnMoreUrl: "https://xdefi.io/support-categories/xdefi-wallet/",
          steps: [
            {
              description: "wallet_connectors.xdefi.extension.step1.description",
              step: "install",
              title: "wallet_connectors.xdefi.extension.step1.title"
            },
            {
              description: "wallet_connectors.xdefi.extension.step2.description",
              step: "create",
              title: "wallet_connectors.xdefi.extension.step2.title"
            },
            {
              description: "wallet_connectors.xdefi.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.xdefi.extension.step3.title"
            }
          ]
        }
      }
    })
  };
};

export {
  xdefiWallet
};
