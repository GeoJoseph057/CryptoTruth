"use client";
// src/wallets/walletConnectors/tokenaryWallet/tokenaryWallet.ts
import { InjectedConnector } from "wagmi/connectors/injected";

// src/utils/browsers.ts
function isSafari() {
  return typeof navigator !== "undefined" && /Version\/([0-9._]+).*Safari/.test(navigator.userAgent);
}

// src/wallets/walletConnectors/tokenaryWallet/tokenaryWallet.ts
var tokenaryWallet = ({
  chains,
  ...options
}) => ({
  id: "tokenary",
  name: "Tokenary",
  iconUrl: async () => (await import("./tokenaryWallet-FZ7BMUTO.js")).default,
  iconBackground: "#ffffff",
  installed: typeof window !== "undefined" && typeof window.ethereum !== "undefined" && window.ethereum.isTokenary,
  hidden: () => !isSafari(),
  downloadUrls: {
    ios: "https://tokenary.io/get",
    mobile: "https://tokenary.io",
    qrCode: "https://tokenary.io/get",
    safari: "https://tokenary.io/get",
    browserExtension: "https://tokenary.io/get"
  },
  createConnector: () => ({
    connector: new InjectedConnector({
      chains,
      options
    })
  })
});

export {
  tokenaryWallet
};
