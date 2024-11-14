import { FeriaCardRedeem } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  redeemFeriaCard,
  RedeemFeriaCardInput,
} from "../api/redeem-feria-card";

export function useRedeemFeriaCard() {
  return useMutation<FeriaCardRedeem, Error, RedeemFeriaCardInput>({
    mutationFn: redeemFeriaCard,
  });
}
