"use client";
// src/wallets/walletConnectors/enkryptWallet/enkryptWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var enkryptWallet = ({
  chains,
  ...options
}) => {
  var _a, _b;
  const isEnkryptInjected = typeof window !== "undefined" && typeof window.enkrypt !== "undefined" && ((_b = (_a = window == null ? void 0 : window.enkrypt) == null ? void 0 : _a.providers) == null ? void 0 : _b.ethereum);
  return {
    id: "enkrypt",
    name: "Enkrypt Wallet",
    installed: isEnkryptInjected ? true : void 0,
    iconUrl: async () => (await import("./enkryptWallet-LVMJVNXI.js")).default,
    iconBackground: "#FFFFFF",
    downloadUrls: {
      qrCode: "https://www.enkrypt.com",
      chrome: "https://chrome.google.com/webstore/detail/enkrypt-ethereum-polkadot/kkpllkodjeloidieedojogacfhpaihoh",
      browserExtension: "https://www.enkrypt.com/",
      edge: "https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/enkrypt/",
      opera: "https://addons.opera.com/en/extensions/details/enkrypt/",
      safari: "https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309"
    },
    createConnector: () => {
      return {
        connector: new InjectedConnector({
          chains,
          options: {
            getProvider: () => {
              var _a2, _b2;
              return isEnkryptInjected ? (_b2 = (_a2 = window == null ? void 0 : window.enkrypt) == null ? void 0 : _a2.providers) == null ? void 0 : _b2.ethereum : void 0;
            },
            ...options
          }
        }),
        extension: {
          instructions: {
            learnMoreUrl: "https://blog.enkrypt.com/what-is-a-web3-wallet/",
            steps: [
              {
                description: "wallet_connectors.enkrypt.extension.step1.description",
                step: "install",
                title: "wallet_connectors.enkrypt.extension.step1.title"
              },
              {
                description: "wallet_connectors.enkrypt.extension.step2.description",
                step: "create",
                title: "wallet_connectors.enkrypt.extension.step2.title"
              },
              {
                description: "wallet_connectors.enkrypt.extension.step3.description",
                step: "refresh",
                title: "wallet_connectors.enkrypt.extension.step3.title"
              }
            ]
          }
        }
      };
    }
  };
};

export {
  enkryptWallet
};
