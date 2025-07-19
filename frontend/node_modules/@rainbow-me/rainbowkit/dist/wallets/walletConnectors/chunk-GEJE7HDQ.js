"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/uniswapWallet/uniswapWallet.ts
var uniswapWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "uniswap",
  name: "Uniswap Wallet",
  iconUrl: async () => (await import("./uniswapWallet-JYAMZDQK.js")).default,
  iconBackground: "#FFD8EA",
  downloadUrls: {
    ios: "https://apps.apple.com/app/apple-store/id6443944476",
    mobile: "https://wallet.uniswap.org/",
    qrCode: "https://wallet.uniswap.org/"
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({
      projectId,
      chains,
      version: walletConnectVersion,
      options: walletConnectOptions
    });
    return {
      connector,
      mobile: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector, walletConnectVersion);
          return `uniswap://wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      qrCode: {
        getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: "https://wallet.uniswap.org/",
          steps: [
            {
              description: "wallet_connectors.uniswap.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.uniswap.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.uniswap.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.uniswap.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.uniswap.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.uniswap.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  uniswapWallet
};
