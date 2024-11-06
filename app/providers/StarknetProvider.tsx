'use client';

import { Chain, sepolia } from "@starknet-react/chains";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector";
import { RpcProvider } from "starknet";

// Create connector instance outside of component
export const connector = new ControllerConnector({
  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
  // Add any additional configuration as needed
});

// Configure RPC provider
function provider(chain: Chain) {
  return new RpcProvider({
    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      connectors={[connector]}
      explorer={starkscan}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}