"use client";

import { useRedeemFeriaCard } from "../hooks/useRedeemFeriaCard";
import { useForm } from "react-hook-form";

type RedeemFeriaCardInputs = {
  cardCode: string;
  walletAddress: string;
  username: string;
};

export function RedeemFeriaCardForm() {
  const { mutate: redeemFeriaCard, isPending, error } = useRedeemFeriaCard();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RedeemFeriaCardInputs>();

  const onSubmit = (data: RedeemFeriaCardInputs) => {
    redeemFeriaCard(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 border-4 border-black bg-blue-100 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <h2 className="border-b-4 border-black pb-2 text-xl font-bold">
        Redeem Feria Card
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
        <label className="font-bold">Wallet Address</label>
        <input
          {...register("walletAddress", {
            required: "Wallet address is required",
          })}
          className="border-4 border-black p-2"
        />
        {errors.walletAddress && (
          <span className="text-red-500">{errors.walletAddress.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold">Username</label>
        <input
          {...register("username", { required: "Username is required" })}
          className="border-4 border-black p-2"
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 transform bg-black p-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        {isPending ? "Redeeming..." : "Redeem Feria Card"}
      </button>

      {error && (
        <p className="mt-2 border-2 border-red-500 p-2 text-red-500">
          {error.message}
        </p>
      )}
    </form>
  );
}
