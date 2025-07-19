"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";
import {
  isAndroid
} from "./chunk-ZOLACFTK.js";

// src/wallets/walletConnectors/omniWallet/omniWallet.ts
var omniWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "omni",
  name: "Omni",
  iconUrl: async () => (await import("./omniWallet-VF54LPLK.js")).default,
  iconBackground: "#000",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=fi.steakwallet.app",
    ios: "https://itunes.apple.com/us/app/id1569375204",
    mobile: "https://omniwallet.app.link",
    qrCode: "https://omniwallet.app.link"
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
          return isAndroid() ? uri : `omni://wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      qrCode: {
        getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: "https://omni.app/support",
          steps: [
            {
              description: "wallet_connectors.omni.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.omni.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.omni.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.omni.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.omni.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.omni.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  omniWallet
};
