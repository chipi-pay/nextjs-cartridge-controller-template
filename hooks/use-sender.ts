'use client'
import { useAccount, useExplorer, useBalance } from "@starknet-react/core";
import { cairo, Uint256 } from "starknet";
import { useCallback, useState } from "react";
import { ETH_CONTRACT } from "@/app/constants/contracts";

export const useSendToUsername = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [txnHash, setTxnHash] = useState<string>();
    const [amount, setAmount] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [wallet, setWallet] = useState<string>('');

    const { account } = useAccount();
    const explorer = useExplorer();
    
    const { data: balance, error } = useBalance({
        address: account?.address as `0x${string}`,
        token: ETH_CONTRACT,
    });

    const handleUsername = (username: string) => {
        setUsername(username);
        //todo fetch wallet address from username
        if (username === '0xvato') {
            setWallet('0x04f905120587e7ff2765ff785415fa582868bcdf8306163f0b05524cc792b51f');
        } else {
            setWallet('');
        }
    }

    const execute = useCallback(
        async (amount: Uint256) => {
            if (!account || error) return;
            
            setSubmitted(true);
            setTxnHash(undefined);

            if(balance && cairo.uint256(balance.value) >= amount) {
                account
                    .execute([{
                        contractAddress: ETH_CONTRACT,
                        entrypoint: "transfer",
                        calldata: [wallet, amount],
                    }])
                    .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                    .catch((e) => console.error(e))
                    .finally(() => setSubmitted(false));
            } 
        },
        [account, balance, error, wallet]
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
        setMaxAmount
    };
};

export const useSendToWallet = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [txnHash, setTxnHash] = useState<string>();
    const [amount, setAmount] = useState<number>(0);
    const [wallet, setWallet] = useState<string>('');

    const { account } = useAccount();
    const explorer = useExplorer();
    
    const { data: balance, error } = useBalance({
        address: account?.address as `0x${string}`,
        token: ETH_CONTRACT,
    });

    const execute = useCallback(
        async (amount: Uint256) => {
            if (!account || error) return;
            
            setSubmitted(true);
            setTxnHash(undefined);

            if(balance && cairo.uint256(balance.value) >= amount) {
                account
                    .execute([{
                        contractAddress: ETH_CONTRACT,
                        entrypoint: "transfer",
                        calldata: [wallet, amount],
                    }])
                    .then(({ transaction_hash }) => setTxnHash(transaction_hash))
                    .catch((e) => console.error(e))
                    .finally(() => setSubmitted(false));
            } 
        },
        [account, balance, error, wallet]
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
        setMaxAmount
    };
};