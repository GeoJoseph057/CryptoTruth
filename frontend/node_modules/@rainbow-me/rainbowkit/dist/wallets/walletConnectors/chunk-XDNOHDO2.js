"use client";
import {
  hasInjectedProvider
} from "./chunk-MQYCNKY3.js";
import {
  isIOS
} from "./chunk-ZOLACFTK.js";

// src/wallets/walletConnectors/coinbaseWallet/coinbaseWallet.ts
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
var coinbaseWallet = ({
  appName,
  chains,
  ...options
}) => {
  const isCoinbaseWalletInjected = hasInjectedProvider("isCoinbaseWallet");
  return {
    id: "coinbase",
    name: "Coinbase Wallet",
    shortName: "Coinbase",
    iconUrl: async () => (await import("./coinbaseWallet-2OUR5TUP.js")).default,
    iconAccent: "#2c5ff6",
    iconBackground: "#2c5ff6",
    installed: isCoinbaseWalletInjected || void 0,
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=org.toshi",
      ios: "https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455",
      mobile: "https://coinbase.com/wallet/downloads",
      qrCode: "https://coinbase-wallet.onelink.me/q5Sx/fdb9b250",
      chrome: "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
      browserExtension: "https://coinbase.com/wallet"
    },
    createConnector: () => {
      const ios = isIOS();
      const connector = new CoinbaseWalletConnector({
        chains,
        options: {
          appName,
          headlessMode: true,
          ...options
        }
      });
      const getUri = async () => (await connector.getProvider()).qrUrl;
      return {
        connector,
        ...ios ? {} : {
          qrCode: {
            getUri,
            instructions: {
              learnMoreUrl: "https://coinbase.com/wallet/articles/getting-started-mobile",
              steps: [
                {
                  description: "wallet_connectors.coinbase.qr_code.step1.description",
                  step: "install",
                  title: "wallet_connectors.coinbase.qr_code.step1.title"
                },
                {
                  description: "wallet_connectors.coinbase.qr_code.step2.description",
                  step: "create",
                  title: "wallet_connectors.coinbase.qr_code.step2.title"
                },
                {
                  description: "wallet_connectors.coinbase.qr_code.step3.description",
                  step: "scan",
                  title: "wallet_connectors.coinbase.qr_code.step3.title"
                }
              ]
            }
          },
          extension: {
            instructions: {
              learnMoreUrl: "https://coinbase.com/wallet/articles/getting-started-extension",
              steps: [
                {
                  description: "wallet_connectors.coinbase.extension.step1.description",
                  step: "install",
                  title: "wallet_connectors.coinbase.extension.step1.title"
                },
                {
                  description: "wallet_connectors.coinbase.extension.step2.description",
                  step: "create",
                  title: "wallet_connectors.coinbase.extension.step2.title"
                },
                {
                  description: "wallet_connectors.coinbase.extension.step3.description",
                  step: "refresh",
                  title: "wallet_connectors.coinbase.extension.step3.title"
                }
              ]
            }
          }
        }
      };
    }
  };
};

export {
  coinbaseWallet
};
