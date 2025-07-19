"use client";
import {
  isMobile
} from "./chunk-ZOLACFTK.js";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/tokenPocketWallet/tokenPocketWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var tokenPocketWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2"
}) => {
  var _a;
  const isTokenPocketInjected = typeof window !== "undefined" && ((_a = window.ethereum) == null ? void 0 : _a.isTokenPocket) === true;
  const shouldUseWalletConnect = !isTokenPocketInjected;
  return {
    id: "tokenPocket",
    name: "TokenPocket",
    iconUrl: async () => (await import("./tokenPocketWallet-UYD66DEM.js")).default,
    iconBackground: "#2980FE",
    installed: !shouldUseWalletConnect ? isTokenPocketInjected : void 0,
    downloadUrls: {
      chrome: "https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii",
      browserExtension: "https://extension.tokenpocket.pro/",
      android: "https://play.google.com/store/apps/details?id=vip.mytokenpocket",
      ios: "https://apps.apple.com/us/app/tp-global-wallet/id6444625622",
      qrCode: "https://tokenpocket.pro/en/download/app",
      mobile: "https://tokenpocket.pro/en/download/app"
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        chains,
        projectId,
        options: walletConnectOptions,
        version: walletConnectVersion
      }) : new InjectedConnector({ chains });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return isMobile() ? `tpoutside://wc?uri=${encodeURIComponent(uri)}` : uri;
      };
      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : void 0
        },
        qrCode: shouldUseWalletConnect ? {
          getUri,
          instructions: {
            learnMoreUrl: "https://help.tokenpocket.pro/en/",
            steps: [
              {
                description: "wallet_connectors.token_pocket.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.token_pocket.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.token_pocket.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.token_pocket.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.token_pocket.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.token_pocket.qr_code.step3.title"
              }
            ]
          }
        } : void 0,
        extension: {
          instructions: {
            learnMoreUrl: "https://help.tokenpocket.pro/en/extension-wallet/faq/installation-tutorial",
            steps: [
              {
                description: "wallet_connectors.token_pocket.extension.step1.description",
                step: "install",
                title: "wallet_connectors.token_pocket.extension.step1.title"
              },
              {
                description: "wallet_connectors.token_pocket.extension.step2.description",
                step: "create",
                title: "wallet_connectors.token_pocket.extension.step2.title"
              },
              {
                description: "wallet_connectors.token_pocket.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.token_pocket.extension.step3.title"
              }
            ]
          }
        }
      };
    }
  };
};

export {
  tokenPocketWallet
};
