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
import { USDC_CONTRACT as USDC_TOKEN_ADDRESS, STRK_FARM_USDC_SENSEI } from "@/app/constants/contracts";

function provider() {
  return new RpcProvider({
      nodeUrl: "https://api.cartridge.gg/x/starknet/mainnet",
  });
}
export const connector = new ControllerConnector({

  policies: [
    {
      target: USDC_TOKEN_ADDRESS,
      method: "approve",
      description:
        "Approve to ChipiPay contract to transfer USDC on your behalf.",
    },
    {
      target: STRK_FARM_USDC_SENSEI,
      method: "deposit",
    },
    
    // Add more policies as needed
  ],
  // Uncomment to use a custom theme
  // theme: "dope-wars",
  // colorMode: "light"

  rpc: "https://api.cartridge.gg/x/starknet/mainnet",
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={[connector as never as Connector]}
      explorer={voyager}

    >
      {children}
    </StarknetConfig>
  );
}