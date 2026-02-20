"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getProgram, type AcademyProgram } from "@/lib/program";

export function useProgram(): AcademyProgram | null {
  const { connection } = useConnection();
  const wallet = useWallet();
  return useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions)
      return null;
    return getProgram(connection, wallet);
  }, [connection, wallet]);
}
