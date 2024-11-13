"use client";

import { useCreateFeriaCard } from "../hooks/useCreateFeriaCard";
import { useForm } from "react-hook-form";
import { ChainEnum, CoinEnum } from "@prisma/client";

type CreateFeriaCardInputs = {
  cardCode: string;
  amount: number;
  name: string;
  maxRedeems: number;
  maxRedeemsPerUser: number;
  chain: ChainEnum;
  coin: CoinEnum;
};

export function CreateFeriaCardForm() {
  const { mutate: createFeriaCard, isPending } = useCreateFeriaCard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFeriaCardInputs>();

  const onSubmit = (data: CreateFeriaCardInputs) => {
    createFeriaCard(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 border-4 border-black bg-yellow-100 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <h2 className="border-b-4 border-black pb-2 text-xl font-bold">
        Create Feria Card
      </h2>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Card Code</label>
        <input
          {...register("cardCode", { required: "Card code is required" })}
          className="border-4 border-black p-2"
        />
        {errors.cardCode && (
          <span className="text-red-500">{errors.cardCode.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Amount</label>
        <input
          {...register("amount", {
            required: "Amount is required",
            valueAsNumber: true,
          })}
          className="border-4 border-black p-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="border-4 border-black p-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Max Redeems</label>
        <input
          {...register("maxRedeems", {
            required: "Max redeems is required",
            valueAsNumber: true,
          })}
          className="border-4 border-black p-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Max Redeems Per User</label>
        <input
          {...register("maxRedeemsPerUser", {
            required: "Max redeems per user is required",
            valueAsNumber: true,
          })}
          className="border-4 border-black p-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Chain</label>
        <select {...register("chain")} className="border-4 border-black p-2">
          {Object.values(ChainEnum).map((chain) => (
            <option key={chain} value={chain}>
              {chain}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Coin</label>
        <select {...register("coin")} className="border-4 border-black p-2">
          {Object.values(CoinEnum).map((coin) => (
            <option key={coin} value={coin}>
              {coin}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 transform bg-black p-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        {isPending ? "Creating..." : "Create Feria Card"}
      </button>
    </form>
  );
}
