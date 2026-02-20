"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";
import { getConfigPda } from "@/lib/program";

export interface ConfigAccount {
  authority: PublicKey;
  backendSigner: PublicKey;
  xpMint: PublicKey;
}

export function useConfig() {
  const program = useProgram();
  const configPda = program ? getConfigPda(program.programId) : null;

  return useQuery({
    queryKey: ["config"],
    queryFn: async (): Promise<ConfigAccount | null> => {
      if (!program || !configPda) return null;
      return (program.account as { config: { fetch: (p: PublicKey) => Promise<ConfigAccount> } }).config.fetch(configPda);
    },
    enabled: !!program && !!configPda,
    refetchInterval: 30_000,
  });
}
