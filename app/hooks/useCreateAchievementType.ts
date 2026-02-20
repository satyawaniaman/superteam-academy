"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAchievementType,
  type CreateAchievementTypeParams,
} from "@/lib/services/backend-api";

export function useCreateAchievementType() {
  return useMutation({
    mutationFn: async (params: CreateAchievementTypeParams) => {
      const result = await createAchievementType(params);
      if (result.error) throw new Error(result.error);
      return { tx: result.tx!, collection: result.collection };
    },
    onSuccess: (_, params) => {
      toast.success(`Achievement type "${params.achievementId}" created.`);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
