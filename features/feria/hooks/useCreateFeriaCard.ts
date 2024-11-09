import { FeriaCard } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { createFeriaCard, CreateFeriaCardInput } from "../api/createFeriaCard";

export function useCreateFeriaCard() {
  return useMutation<FeriaCard, Error, CreateFeriaCardInput>({
    mutationFn: createFeriaCard,
  });
}
