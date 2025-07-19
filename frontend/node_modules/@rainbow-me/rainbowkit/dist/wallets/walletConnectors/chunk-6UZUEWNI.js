"use client";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/subWallet/subWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var getSubWalletInjectedProvider = () => {
  if (typeof window === "undefined")
    return;
  return window.SubWallet;
};
var subWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isSubWalletInjected = Boolean(getSubWalletInjectedProvider());
  const shouldUseWalletConnect = !isSubWalletInjected;
  return {
    id: "subwallet",
    name: "SubWallet",
    iconUrl: async () => (await import("./subWallet-ELA2UJOS.js")).default,
    iconBackground: "#fff",
    installed: isSubWalletInjected || void 0,
    downloadUrls: {
      browserExtension: "https://www.subwallet.app/download",
      chrome: "https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/subwallet/",
      edge: "https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn",
      mobile: "https://www.subwallet.app/download",
      android: "https://play.google.com/store/apps/details?id=app.subwallet.mobile",
      ios: "https://apps.apple.com/us/app/subwallet-polkadot-wallet/id1633050285",
      qrCode: "https://www.subwallet.app/download"
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        projectId,
        chains,
        version: walletConnectVersion,
        options: walletConnectOptions
      }) : new InjectedConnector({
        chains,
        options: {
          getProvider: getSubWalletInjectedProvider,
          ...options
        }
      });
      const getUriMobile = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return `subwallet://wc?uri=${encodeURIComponent(uri)}`;
      };
      const getUriQR = async () => {
        return await getWalletConnectUri(connector, walletConnectVersion);
      };
      const mobileConnector = {
        getUri: shouldUseWalletConnect ? getUriMobile : void 0
      };
      let qrConnector = void 0;
      if (shouldUseWalletConnect) {
        qrConnector = {
          getUri: getUriQR,
          instructions: {
            learnMoreUrl: "https://www.subwallet.app/",
            steps: [
              {
                description: "wallet_connectors.subwallet.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.subwallet.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.subwallet.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.subwallet.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.subwallet.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.subwallet.qr_code.step3.title"
              }
            ]
          }
        };
      }
      const extensionConnector = {
        instructions: {
          learnMoreUrl: "https://www.subwallet.app/",
          steps: [
            {
              description: "wallet_connectors.subwallet.extension.step1.description",
              step: "install",
              title: "wallet_connectors.subwallet.extension.step1.title"
            },
            {
              description: "wallet_connectors.subwallet.extension.step2.description",
              step: "create",
              title: "wallet_connectors.subwallet.extension.step2.title"
            },
            {
              description: "wallet_connectors.subwallet.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.subwallet.extension.step3.title"
            }
          ]
        }
      };
      return {
        connector,
        mobile: mobileConnector,
        qrCode: qrConnector,
        extension: extensionConnector
      };
    }
  };
};

export {
  subWallet
};
