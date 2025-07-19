"use client";
import {
  hasInjectedProvider
} from "./chunk-MQYCNKY3.js";

// src/wallets/walletConnectors/zealWallet/zealWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";
var zealWallet = ({
  chains,
  ...options
}) => ({
  id: "zeal",
  name: "Zeal",
  iconUrl: async () => (await import("./zealWallet-K7JBLVKT.js")).default,
  iconBackground: "#fff0",
  installed: hasInjectedProvider("isZeal"),
  downloadUrls: {
    browserExtension: "https://zeal.app"
  },
  createConnector: () => ({
    connector: new InjectedConnector({
      chains,
      options
    }),
    extension: {
      instructions: {
        learnMoreUrl: "https://zeal.app/",
        steps: [
          {
            description: "wallet_connectors.zeal.extension.step1.description",
            step: "install",
            title: "wallet_connectors.zeal.extension.step1.title"
          },
          {
            description: "wallet_connectors.zeal.extension.step2.description",
            step: "create",
            title: "wallet_connectors.zeal.extension.step2.title"
          },
          {
            description: "wallet_connectors.zeal.extension.step3.description",
            step: "refresh",
            title: "wallet_connectors.zeal.extension.step3.title"
          }
        ]
      }
    }
  })
});

export {
  zealWallet
};
