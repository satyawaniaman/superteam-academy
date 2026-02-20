"use client";

import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConfig } from "./useConfig";

export function useXpBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { data: config } = useConfig();
  const xpMint = config?.xpMint;

  return useQuery({
    queryKey: ["xpBalance", publicKey?.toBase58() ?? "", xpMint?.toBase58() ?? ""],
    queryFn: async () => {
      if (!publicKey || !xpMint) return 0;
      const ata = getAssociatedTokenAddressSync(
        xpMint,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      try {
        const balance = await connection.getTokenAccountBalance(ata);
        return Number(balance.value.amount);
      } catch {
        return 0;
      }
    },
    enabled: !!publicKey && !!xpMint && !!config,
  });
}
