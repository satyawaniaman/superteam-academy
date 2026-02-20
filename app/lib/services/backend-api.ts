function resolveUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is required");
  return `${base.replace(/\/$/, "")}/academy${path}`;
}

export interface CreateCourseParams {
  courseId?: string;
  lessonCount?: number;
  xpPerLesson?: number;
  creator?: string;
}

export interface CompleteLessonParams {
  courseId?: string;
  learner: string;
  lessonIndex?: number;
}

export interface FinalizeCourseParams {
  courseId?: string;
  learner: string;
}

export interface BackendApiResponse {
  tx?: string;
  error?: string;
}

export async function createCourse(
  params: CreateCourseParams
): Promise<BackendApiResponse> {
  const url = resolveUrl("/create-course");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await res.json().catch(() => ({}))) as BackendApiResponse;
  if (!res.ok) {
    return { error: data.error ?? res.statusText };
  }
  return data;
}

export async function completeLesson(
  params: CompleteLessonParams
): Promise<BackendApiResponse> {
  const url = resolveUrl("/complete-lesson");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await res.json().catch(() => ({}))) as BackendApiResponse;
  if (!res.ok) {
    return { error: data.error ?? res.statusText };
  }
  return data;
}

export async function finalizeCourse(
  params: FinalizeCourseParams
): Promise<BackendApiResponse> {
  const url = resolveUrl("/finalize-course");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await res.json().catch(() => ({}))) as BackendApiResponse;
  if (!res.ok) {
    return { error: data.error ?? res.statusText };
  }
  return data;
}
