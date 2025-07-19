"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/imTokenWallet/imTokenWallet.ts
var imTokenWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "imToken",
  name: "imToken",
  iconUrl: async () => (await import("./imTokenWallet-DMDOIZDQ.js")).default,
  iconBackground: "#098de6",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=im.token.app",
    ios: "https://itunes.apple.com/us/app/imtoken2/id1384798940",
    mobile: "https://token.im/download",
    qrCode: "https://token.im/download"
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
          return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      qrCode: {
        getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: typeof window !== "undefined" && window.navigator.language.includes("zh") ? "https://support.token.im/hc/zh-cn/categories/360000925393" : "https://support.token.im/hc/en-us/categories/360000925393",
          steps: [
            {
              description: "wallet_connectors.im_token.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.im_token.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.im_token.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.im_token.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.im_token.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.im_token.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  imTokenWallet
};
