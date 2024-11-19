"use client";
import { useAccount, useExplorer, useBalance } from "@starknet-react/core";
import { cairo, Uint256 } from "starknet";
import { useCallback, useState } from "react";
import {
  ETH_CONTRACT,
  USDC_CONTRACT,
  STARKNET_BROTHER_TOKEN,
  SLINK_TOKEN,
  ALF_TOKEN,
} from "@/features/web3/constants/contracts";

export const useSendToUsername = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");
  const [errorMessage, setError] = useState<string>();

  const { account } = useAccount();
  const explorer = useExplorer();

  const { data: balance } = useBalance({
    address: account?.address as `0x${string}`,
    token: ETH_CONTRACT,
  });

  const handleUsername = (username: string) => {
    setUsername(username);
    //todo fetch wallet address from username
    if (username === "0xvato") {
      setWallet(
        "0x04f905120587e7ff2765ff785415fa582868bcdf8306163f0b05524cc792b51f",
      );
    } else {
      setWallet("");
    }
  };

  const execute = useCallback(
    async (amount: Uint256) => {
      if (!account) {
        setError("No account connected");
        return;
      }
      if (!wallet) {
        setError("Invalid username");
        return;
      }

      setSubmitted(true);
      setTxnHash(undefined);
      setError(undefined);

      try {
        if (balance && cairo.uint256(balance.value) >= amount) {
          const result = await account.execute([
            {
              contractAddress: ETH_CONTRACT,
              entrypoint: "transfer",
              calldata: [wallet, amount],
            },
          ]);
          setTxnHash(result.transaction_hash);
        } else {
          setError("Insufficient balance");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
      } finally {
        setSubmitted(false);
      }
    },
    [account, balance, wallet],
  );

  const setMaxAmount = () => {
    if (balance) setAmount(Number(balance.formatted));
  };

  return {
    submitted,
    txnHash,
    amount,
    username,
    wallet,
    balance,
    explorer,
    setAmount,
    handleUsername,
    execute,
    setMaxAmount,
    errorMessage,
  };
};

export const useSendToWallet = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [errorMessage, setError] = useState<string>();

  const { account } = useAccount();
  const explorer = useExplorer();

  const { data: balance } = useBalance({
    address: account?.address as `0x${string}`,
    token: USDC_CONTRACT,
  });

  const execute = useCallback(
    async (amount: Uint256) => {
      if (!account) {
        setError("No account connected");
        return;
      }
      if (!wallet) {
        setError("Invalid wallet address");
        return;
      }

      setSubmitted(true);
      setTxnHash(undefined);
      setError(undefined);

      try {
        if (balance && cairo.uint256(balance.value) >= amount) {
          const result = await account.execute([
            {
              contractAddress: USDC_CONTRACT,
              entrypoint: "transfer",
              calldata: [wallet, amount],
            },
          ]);
          setTxnHash(result.transaction_hash);
        } else {
          setError("Insufficient balance");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
      } finally {
        setSubmitted(false);
      }
    },
    [account, balance, wallet],
  );

  const setMaxAmount = () => {
    if (balance) setAmount(Number(balance.formatted));
  };

  return {
    submitted,
    txnHash,
    amount,
    wallet,
    balance,
    explorer,
    setAmount,
    setWallet,
    execute,
    setMaxAmount,
    errorMessage,
  };
};

export const useSendBrotherToken = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [errorMessage, setError] = useState<string>();

  const { account } = useAccount();
  const explorer = useExplorer();

  const { data: balance } = useBalance({
    address: account?.address as `0x${string}`,
    token: STARKNET_BROTHER_TOKEN,
  });

  const execute = useCallback(
    async (amount: Uint256) => {
      if (!account) {
        setError("No account connected");
        return;
      }
      if (!wallet) {
        setError("Invalid wallet address");
        return;
      }

      setSubmitted(true);
      setTxnHash(undefined);
      setError(undefined);

      try {
        if (balance && cairo.uint256(balance.value) >= amount) {
          const result = await account.execute([
            {
              contractAddress: STARKNET_BROTHER_TOKEN,
              entrypoint: "transfer",
              calldata: [wallet, amount],
            },
          ]);
          setTxnHash(result.transaction_hash);
        } else {
          setError("Insufficient balance");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
      } finally {
        setSubmitted(false);
      }
    },
    [account, balance, wallet],
  );

  const setMaxAmount = () => {
    if (balance) setAmount(Number(balance.formatted));
  };

  return {
    submitted,
    txnHash,
    amount,
    wallet,
    balance,
    explorer,
    setAmount,
    setWallet,
    execute,
    setMaxAmount,
    errorMessage,
  };
};

export const useSendSlink = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [errorMessage, setError] = useState<string>();

  const { account } = useAccount();
  const explorer = useExplorer();

  const { data: balance } = useBalance({
    address: account?.address as `0x${string}`,
    token: SLINK_TOKEN,
  });

  const execute = useCallback(
    async (amount: Uint256) => {
      if (!account) {
        setError("No account connected");
        return;
      }
      if (!wallet) {
        setError("Invalid wallet address");
        return;
      }

      setSubmitted(true);
      setTxnHash(undefined);
      setError(undefined);

      try {
        if (balance && cairo.uint256(balance.value) >= amount) {
          const result = await account.execute([
            {
              contractAddress: SLINK_TOKEN,
              entrypoint: "transfer",
              calldata: [wallet, amount],
            },
          ]);
          setTxnHash(result.transaction_hash);
        } else {
          setError("Insufficient balance");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
      } finally {
        setSubmitted(false);
      }
    },
    [account, balance, wallet],
  );

  const setMaxAmount = () => {
    if (balance) setAmount(Number(balance.formatted));
  };

  return {
    submitted,
    txnHash,
    amount,
    wallet,
    balance,
    explorer,
    setAmount,
    setWallet,
    execute,
    setMaxAmount,
    errorMessage,
  };
};

export const useSendAlf = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [wallet, setWallet] = useState<string>("");
  const [errorMessage, setError] = useState<string>();

  const { account } = useAccount();
  const explorer = useExplorer();

  const { data: balance } = useBalance({
    address: account?.address as `0x${string}`,
    token: ALF_TOKEN,
  });

  const execute = useCallback(
    async (amount: Uint256) => {
      if (!account) {
        setError("No account connected");
        return;
      }
      if (!wallet) {
        setError("Invalid wallet address");
        return;
      }

      setSubmitted(true);
      setTxnHash(undefined);
      setError(undefined);

      try {
        if (balance && cairo.uint256(balance.value) >= amount) {
          const result = await account.execute([
            {
              contractAddress: ALF_TOKEN,
              entrypoint: "transfer",
              calldata: [wallet, amount],
            },
          ]);
          setTxnHash(result.transaction_hash);
        } else {
          setError("Insufficient balance");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Transaction failed");
      } finally {
        setSubmitted(false);
      }
    },
    [account, balance, wallet],
  );

  const setMaxAmount = () => {
    if (balance) setAmount(Number(balance.formatted));
  };

  return {
    submitted,
    txnHash,
    amount,
    wallet,
    balance,
    explorer,
    setAmount,
    setWallet,
    execute,
    setMaxAmount,
    errorMessage,
  };
};
