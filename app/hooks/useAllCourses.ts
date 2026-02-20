"use client";

import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./useProgram";

export function useAllCourses() {
  const program = useProgram();

  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!program) return [];
      const accounts = await (program.account as { course: { all: () => Promise<Array<{ publicKey: import("@solana/web3.js").PublicKey; account: unknown }>> } }).course.all();
      return accounts;
    },
    enabled: !!program,
    refetchInterval: 30_000,
  });
}
