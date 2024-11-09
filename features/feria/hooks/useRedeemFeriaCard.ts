import { FeriaCard } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  redeemFeriaCard,
  RedeemFeriaCardInput,
} from "../api/redeemFeriaCard";

export function useRedeemFeriaCard() {
  return useMutation<FeriaCard, Error, RedeemFeriaCardInput>({
    mutationFn: redeemFeriaCard,
  });
}
