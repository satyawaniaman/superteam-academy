"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { finalizeCourse } from "@/lib/services/backend-api";

export interface FinalizeCourseParams {
  courseId?: string;
  learner?: string;
}

export function useFinalizeCourse() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: FinalizeCourseParams) => {
      const learner = params.learner ?? publicKey?.toBase58();
      if (!learner) throw new Error("Learner wallet required");
      const result = await finalizeCourse({
        courseId: params.courseId ?? "test-course-1",
        learner,
      });
      if (result.error) throw new Error(result.error);
      return result.tx!;
    },
    onSuccess: (_, params) => {
      const walletKey = publicKey?.toBase58() ?? params.learner ?? "";
      void queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      void queryClient.invalidateQueries({ queryKey: ["xpBalance", walletKey] });
      toast.success("Course finalized.");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
