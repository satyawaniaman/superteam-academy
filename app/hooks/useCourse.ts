"use client";

import { useQuery } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { getCoursePda } from "@/lib/program";

export function useCourse(courseId: string | null) {
  const program = useProgram();
  const coursePda = program && courseId ? getCoursePda(courseId, program.programId) : null;

  return useQuery({
    queryKey: ["course", courseId ?? ""],
    queryFn: async () => {
      if (!program || !coursePda) return null;
      return (program.account as { course: { fetch: (p: typeof coursePda) => Promise<unknown> } }).course.fetch(coursePda);
    },
    enabled: !!program && !!courseId && !!coursePda,
    refetchInterval: 30_000,
  });
}
