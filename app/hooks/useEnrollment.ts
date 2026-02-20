"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { getEnrollmentPda } from "@/lib/program";

export function useEnrollment(courseId: string | null) {
  const program = useProgram();
  const { publicKey } = useWallet();
  const enrollmentPda =
    program && courseId && publicKey
      ? getEnrollmentPda(courseId, publicKey, program.programId)
      : null;

  return useQuery({
    queryKey: ["enrollment", courseId ?? "", publicKey?.toBase58() ?? ""],
    queryFn: async () => {
      if (!program || !enrollmentPda) return null;
      return (program.account as { enrollment: { fetchNullable: (p: typeof enrollmentPda) => Promise<unknown> } }).enrollment.fetchNullable(enrollmentPda);
    },
    enabled: !!program && !!courseId && !!publicKey && !!enrollmentPda,
  });
}
