"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import type { AnchorError } from "@coral-xyz/anchor";
import { useProgram } from "./useProgram";
import { getCoursePda, getEnrollmentPda } from "@/lib/program";
import { getAnchorErrorMessage } from "@/lib/anchor-error-messages";

export interface CloseEnrollmentParams {
  courseId: string;
}

export function useCloseEnrollment() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId }: CloseEnrollmentParams) => {
      if (!program || !publicKey) throw new Error("Wallet not connected");
      const coursePda = getCoursePda(courseId, program.programId);
      const enrollmentPda = getEnrollmentPda(courseId, publicKey, program.programId);
      return program.methods
        .closeEnrollment()
        .accountsPartial({
          course: coursePda,
          enrollment: enrollmentPda,
          learner: publicKey,
        })
        .rpc();
    },
    onSuccess: (_, { courseId }) => {
      const walletKey = publicKey?.toBase58() ?? "";
      void queryClient.invalidateQueries({ queryKey: ["enrollment", courseId, walletKey] });
      void queryClient.invalidateQueries({ queryKey: ["xpBalance", walletKey] });
      void queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast.success("Enrollment closed.");
    },
    onError: (err: unknown) => {
      const code = (err as AnchorError)?.error?.errorCode?.code;
      toast.error(getAnchorErrorMessage(String(code ?? "")));
    },
  });
}
