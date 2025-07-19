"use client";
import {
  isAndroid
} from "./chunk-ZOLACFTK.js";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/ledgerWallet/ledgerWallet.ts
var ledgerWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => ({
  id: "ledger",
  iconBackground: "#000",
  iconAccent: "#000",
  name: "Ledger",
  iconUrl: async () => (await import("./ledgerWallet-DIS4VM6H.js")).default,
  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=com.ledger.live",
    ios: "https://apps.apple.com/us/app/ledger-live-web3-wallet/id1361671700",
    mobile: "https://www.ledger.com/ledger-live",
    qrCode: "https://r354.adj.st/?adj_t=t2esmlk",
    windows: "https://www.ledger.com/ledger-live/download",
    macos: "https://www.ledger.com/ledger-live/download",
    linux: "https://www.ledger.com/ledger-live/download",
    desktop: "https://www.ledger.com/ledger-live"
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
          return isAndroid() ? uri : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
        }
      },
      desktop: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector, walletConnectVersion);
          return `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
        },
        instructions: {
          learnMoreUrl: "https://support.ledger.com/hc/en-us/articles/4404389503889-Getting-started-with-Ledger-Live",
          steps: [
            {
              description: "wallet_connectors.ledger.desktop.step1.description",
              step: "install",
              title: "wallet_connectors.ledger.desktop.step1.title"
            },
            {
              description: "wallet_connectors.ledger.desktop.step2.description",
              step: "create",
              title: "wallet_connectors.ledger.desktop.step2.title"
            },
            {
              description: "wallet_connectors.ledger.desktop.step3.description",
              step: "connect",
              title: "wallet_connectors.ledger.desktop.step3.title"
            }
          ]
        }
      },
      qrCode: {
        getUri: async () => {
          const uri = await getWalletConnectUri(connector, walletConnectVersion);
          return `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
        },
        instructions: {
          learnMoreUrl: "https://support.ledger.com/hc/en-us/articles/4404389503889-Getting-started-with-Ledger-Live",
          steps: [
            {
              description: "wallet_connectors.ledger.qr_code.step1.description",
              step: "install",
              title: "wallet_connectors.ledger.qr_code.step1.title"
            },
            {
              description: "wallet_connectors.ledger.qr_code.step2.description",
              step: "create",
              title: "wallet_connectors.ledger.qr_code.step2.title"
            },
            {
              description: "wallet_connectors.ledger.qr_code.step3.description",
              step: "scan",
              title: "wallet_connectors.ledger.qr_code.step3.title"
            }
          ]
        }
      }
    };
  }
});

export {
  ledgerWallet
};
