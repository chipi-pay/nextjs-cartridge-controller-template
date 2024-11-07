/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  voyager,
  Connector,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { RpcProvider } from "starknet";
import { ETH_CONTRACT as ETH_TOKEN_ADDRESS } from "@/app/constants/contracts";

function provider() {
  return new RpcProvider({
      nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}
export const connector = new ControllerConnector({

  policies: [
    {
      target: ETH_TOKEN_ADDRESS,
      method: "approve",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      target: ETH_TOKEN_ADDRESS,
      method: "transfer",
    },
    
    // Add more policies as needed
  ],
  // Uncomment to use a custom theme
  // theme: "dope-wars",
  // colorMode: "light"

  rpc: "https://api.cartridge.gg/x/starknet/sepolia",

  
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[connector as never as Connector]}
      explorer={voyager}

    >
      {children}
    </StarknetConfig>
  );
}