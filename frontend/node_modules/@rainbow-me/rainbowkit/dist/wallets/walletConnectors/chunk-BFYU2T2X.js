"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";
import {
  isAndroid
} from "./chunk-ZOLACFTK.js";

// src/wallets/walletConnectors/argentWallet/argentWallet.ts
var argentWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "argent",
  name: "Argent",
  iconUrl: async () => (await import("./argentWallet-5OEFC7BD.js")).default,
  iconBackground: "#fff",
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=im.argent.contractwalletclient",
    ios: "https://apps.apple.com/us/app/argent/id1358741926",
    mobile: "https://argent.xyz/download-argent",
    qrCode: "https://argent.link/app"
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
          return isAndroid() ? uri : `argent://app/wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      qrCode: {
        getUri: async () => getWalletConnectUri(connector, walletConnectVersion),
        instructions: {
          learnMoreUrl: "https://argent.xyz/learn/what-is-a-crypto-wallet/",
          steps: [
            {
              description: "wallet_connectors.argent.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.argent.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.argent.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.argent.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.argent.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.argent.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  argentWallet
};
