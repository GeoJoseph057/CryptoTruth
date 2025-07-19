"use client";
import {
  getInjectedConnector,
  hasInjectedProvider
} from "./chunk-MQYCNKY3.js";
import {
  isMobile
} from "./chunk-ZOLACFTK.js";
import {
  getWalletConnectConnector,
  getWalletConnectUri
} from "./chunk-7IPLF2TT.js";

// src/wallets/walletConnectors/trustWallet/trustWallet.ts
var trustWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isTrustWalletInjected = isMobile() ? hasInjectedProvider("isTrust") : hasInjectedProvider("isTrustWallet");
  const shouldUseWalletConnect = !isTrustWalletInjected;
  return {
    id: "trust",
    name: "Trust Wallet",
    iconUrl: async () => (await import("./trustWallet-FST5ID2K.js")).default,
    installed: isTrustWalletInjected || void 0,
    iconAccent: "#3375BB",
    iconBackground: "#fff",
    downloadUrls: {
      android: "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
      ios: "https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/id1288339409",
      mobile: "https://trustwallet.com/download",
      qrCode: "https://trustwallet.com/download",
      chrome: "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
      browserExtension: "https://trustwallet.com/browser-extension"
    },
    createConnector: () => {
      const getUriMobile = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return `trust://wc?uri=${encodeURIComponent(uri)}`;
      };
      const getUriQR = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return uri;
      };
      const connector = shouldUseWalletConnect ? getWalletConnectConnector({
        projectId,
        chains,
        version: walletConnectVersion,
        options: walletConnectOptions
      }) : isMobile() ? getInjectedConnector({ flag: "isTrust", chains, options }) : getInjectedConnector({ flag: "isTrustWallet", chains, options });
      const mobileConnector = {
        getUri: shouldUseWalletConnect ? getUriMobile : void 0
      };
      let qrConnector = void 0;
      if (shouldUseWalletConnect) {
        qrConnector = {
          getUri: getUriQR,
          instructions: {
            learnMoreUrl: "https://trustwallet.com/",
            steps: [
              {
                description: "wallet_connectors.trust.qr_code.step1.description",
                step: "install",
                title: "wallet_connectors.trust.qr_code.step1.title"
              },
              {
                description: "wallet_connectors.trust.qr_code.step2.description",
                step: "create",
                title: "wallet_connectors.trust.qr_code.step2.title"
              },
              {
                description: "wallet_connectors.trust.qr_code.step3.description",
                step: "scan",
                title: "wallet_connectors.trust.qr_code.step3.title"
              }
            ]
          }
        };
      }
      const extensionConnector = {
        instructions: {
          learnMoreUrl: "https://trustwallet.com/browser-extension",
          steps: [
            {
              description: "wallet_connectors.trust.extension.step1.description",
              step: "install",
              title: "wallet_connectors.trust.extension.step1.title"
            },
            {
              description: "wallet_connectors.trust.extension.step2.description",
              step: "create",
              title: "wallet_connectors.trust.extension.step2.title"
            },
            {
              description: "wallet_connectors.trust.extension.step3.description",
              step: "refresh",
              title: "wallet_connectors.trust.extension.step3.title"
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
  trustWallet
};
