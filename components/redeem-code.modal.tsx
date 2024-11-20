"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRedeemFeriaCard } from "@/features/feria-cards/hooks/use-redeem-feria-card";
import { useAccount } from "@starknet-react/core";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface RedeemCodeModalProps {
  onBack?: () => void;
}

export function RedeemCodeModal({ onBack = () => {} }: RedeemCodeModalProps) {
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { account } = useAccount();
  const { mutate: redeemFeriaCard, isPending: isRedeemingFeriaCard } =
    useRedeemFeriaCard();

  const handleRedeem = async () => {
    console.log("Redeeming feria card...", code);
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a code",
        variant: "destructive",
      });
      return;
    }

    redeemFeriaCard(
      {
        cardCode: code,
        walletAddress: account?.address as string,
        username: account?.address as string,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Redeem successful!",
            description: `Code ${data.feriaCardCode} redeemed successfully`,
          });
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to process rewards. Please try again later.";
          toast({
            title: "Redeem failed",
            description: errorMessage,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Transition show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onBack}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-start">
                    <button
                      className="mr-2 hover:bg-accent hover:text-accent-foreground"
                      onClick={onBack}
                    >
                      <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h2 className="text-center text-lg font-medium">
                      Redeem Code
                    </h2>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex w-full flex-col">
                      <label className="mb-2 w-full text-left text-lg">
                        Amount
                      </label>
                      <input
                        className="flex h-14 w-full flex-col items-center gap-4 rounded-xl border-2 border-black bg-[#FFFCF9] bg-white p-2.5 p-6 text-center text-lg hover:bg-orange-100 focus:bg-[#fed2aa] focus:outline-none active:bg-orange-200"
                        placeholder="Amount"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>

                    <button
                      className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-emerald-400 p-2.5 text-center text-xl font-medium hover:bg-emerald-500 active:bg-emerald-600"
                      onClick={handleRedeem}
                      disabled={isRedeemingFeriaCard}
                    >
                      {isRedeemingFeriaCard ? "Redeeming..." : "Redeem"}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
