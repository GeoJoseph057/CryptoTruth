"use client";
// src/wallets/getInjectedConnector.ts
import { InjectedConnector } from "wagmi/connectors/injected";
function getExplicitInjectedProvider(flag) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined")
    return;
  const providers = window.ethereum.providers;
  return providers ? providers.find((provider) => provider[flag]) : window.ethereum[flag] ? window.ethereum : void 0;
}
function hasInjectedProvider(flag) {
  return Boolean(getExplicitInjectedProvider(flag));
}
function getInjectedProvider(flag) {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined")
    return;
  const providers = window.ethereum.providers;
  const provider = getExplicitInjectedProvider(flag);
  if (provider)
    return provider;
  if (typeof providers !== "undefined" && providers.length > 0)
    return providers[0];
  return window.ethereum;
}
function getInjectedConnector({
  chains,
  flag,
  options
}) {
  return new InjectedConnector({
    chains,
    options: {
      getProvider: () => getInjectedProvider(flag),
      ...options
    }
  });
}

export {
  hasInjectedProvider,
  getInjectedConnector
};
