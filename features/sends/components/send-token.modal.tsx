"use client";

import { Fragment, useMemo, useState } from "react";

import { useSendToWallet } from "@/hooks/use-sender";
import {
  useSendBrotherToken,
  useSendSlink,
  useSendAlf,
} from "@/hooks/use-sender";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { TokenPicker } from "@/features/web3/components/token.picker";

interface SendTokenModalProps {
  onBack: () => void;
  isOpen: boolean; // changed from 'open'
  onClose: () => void;
}

export function SendTokenModal({
  onBack,
  isOpen,
  onClose,
}: SendTokenModalProps) {
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState("usdc");
  const usdcSender = useSendToWallet();
  const brotherSender = useSendBrotherToken();
  const slinkSender = useSendSlink();
  const alfSender = useSendAlf();

  const sender = useMemo(() => {
    switch (selectedToken) {
      case "usdc":
        return usdcSender;
      case "brother":
        return brotherSender;
      case "slink":
        return slinkSender;
      case "alf":
        return alfSender;
      default:
        return usdcSender;
    }
  }, [selectedToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const decimals = {
      usdc: 6,
      brother: 18,
      slink: 18,
      alf: 18,
    };

    const amount =
      sender.amount *
      Math.pow(10, decimals[selectedToken as keyof typeof decimals]);

    sender
      .execute({ low: amount, high: 0 })
      .then(() => {
        if (sender.txnHash) {
          toast({
            title: "Transaction Submitted",
            description: (
              <a
                href={`https://starkscan.co/tx/${sender.txnHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Explorer
              </a>
            ),
          });
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Transaction Failed",
          description: error.message,
        });
      });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                      Send Token
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TokenPicker
                      token={selectedToken}
                      setToken={setSelectedToken}
                    />
                    <div className="flex w-full flex-col">
                      <label className="mb-2 w-full text-left text-lg">
                        Recipient Username
                      </label>
                      <input
                        className="flex h-14 w-full flex-col items-center gap-4 rounded-xl border-2 border-black bg-[#FFFCF9] bg-white p-2.5 p-6 text-center text-lg hover:bg-orange-100 focus:bg-[#fed2aa] focus:outline-none active:bg-orange-200"
                        placeholder="Recipient Address"
                        value={sender.wallet}
                        onChange={(e) => sender.setWallet(e.target.value)}
                      />
                      {/* {error && (
                          <div className="mt-2 rounded-xl border-2 border-black bg-red-400 p-2 text-center text-black">
                            {error}
                          </div>
                        )} */}
                    </div>
                    <div className="flex w-full flex-col">
                      <label className="mb-2 w-full text-left text-lg">
                        Amount
                      </label>
                      <input
                        className="flex h-14 w-full flex-col items-center gap-4 rounded-xl border-2 border-black bg-[#FFFCF9] bg-white p-2.5 p-6 text-center text-lg hover:bg-orange-100 focus:bg-[#fed2aa] focus:outline-none active:bg-orange-200"
                        placeholder="Amount"
                        value={sender.amount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numberValue = value === "" ? 0 : Number(value);
                          if (!isNaN(numberValue)) {
                            sender.setAmount(numberValue);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-emerald-400 p-2.5 text-center text-xl font-medium hover:bg-emerald-500 active:bg-emerald-600"
                      disabled={sender.submitted}
                    >
                      {sender.submitted ? "Sending..." : "Send"}
                    </button>

                    {sender.errorMessage && (
                      <p className="text-sm text-red-500">
                        {sender.errorMessage}
                      </p>
                    )}
                    {sender.txnHash && (
                      <p className="text-sm text-green-500">
                        Transaction submitted! View on{" "}
                        <a
                          href={`https://starkscan.co/tx/${sender.txnHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Explorer
                        </a>
                      </p>
                    )}
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
