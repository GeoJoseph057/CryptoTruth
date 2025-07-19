"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";
import {
  isAndroid
} from "./chunk-ZOLACFTK.js";

// src/wallets/walletConnectors/oktoWallet/oktoWallet.ts
var oktoWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "Okto",
  name: "Okto",
  iconUrl: async () => (await import("./oktoWallet-3LTNTBG3.js")).default,
  iconBackground: "#fff",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=im.okto.contractwalletclient",
    ios: "https://apps.apple.com/in/app/okto-wallet/id6450688229",
    mobile: "https://okto.tech/",
    qrCode: "https://okto.tech/"
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
          return isAndroid() ? uri : `okto://wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      qrCode: {
        getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: "https://okto.tech/",
          steps: [
            {
              description: "wallet_connectors.okto.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.okto.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.okto.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.okto.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.okto.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.okto.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  oktoWallet
};
