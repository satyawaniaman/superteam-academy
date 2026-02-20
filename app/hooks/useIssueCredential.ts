"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import {
  issueCredential,
  type IssueCredentialParams as ApiParams,
} from "@/lib/services/backend-api";

export interface IssueCredentialParams extends Partial<ApiParams> {
  learner: string;
  credentialName: string;
  metadataUri: string;
  trackCollection: string;
  courseId?: string;
  coursesCompleted?: number;
  totalXp?: number;
}

export function useIssueCredential() {
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: IssueCredentialParams) => {
      const learner = params.learner ?? publicKey?.toBase58();
      if (!learner) throw new Error("Learner wallet required");
      const result = await issueCredential({
        courseId: params.courseId ?? "test-course-1",
        learner,
        credentialName: params.credentialName,
        metadataUri: params.metadataUri,
        trackCollection: params.trackCollection,
        coursesCompleted: params.coursesCompleted ?? 1,
        totalXp: params.totalXp ?? 0,
      });
      if (result.error) throw new Error(result.error);
      return { tx: result.tx!, credentialAsset: result.credentialAsset };
    },
    onSuccess: (_, params) => {
      void queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      toast.success("Credential issued.");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
