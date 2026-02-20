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

export interface UpdateConfigParams {
  newBackendSigner: string;
}

export interface UpdateCourseParams {
  courseId?: string;
  newContentTxId?: number[] | null;
  newIsActive?: boolean | null;
  newXpPerLesson?: number | null;
  newCreatorRewardXp?: number | null;
  newMinCompletionsForReward?: number | null;
}

export interface IssueCredentialParams {
  courseId?: string;
  learner: string;
  credentialName: string;
  metadataUri: string;
  coursesCompleted?: number;
  totalXp?: number;
  trackCollection: string;
}

export interface UpgradeCredentialParams {
  courseId?: string;
  learner: string;
  credentialAsset: string;
  credentialName: string;
  metadataUri: string;
  coursesCompleted?: number;
  totalXp?: number;
  trackCollection: string;
}

export interface RegisterMinterParams {
  minter: string;
  label?: string;
  maxXpPerCall?: number;
}

export interface RevokeMinterParams {
  minter: string;
}

export interface RewardXpParams {
  recipient: string;
  amount: number;
  memo?: string;
}

export interface CreateAchievementTypeParams {
  achievementId: string;
  name: string;
  metadataUri: string;
  maxSupply?: number;
  xpReward?: number;
}

export interface AwardAchievementParams {
  achievementId: string;
  recipient: string;
  collection: string;
}

export interface DeactivateAchievementTypeParams {
  achievementId: string;
}

export interface BackendApiResponse {
  tx?: string;
  error?: string;
  credentialAsset?: string;
  collection?: string;
  asset?: string;
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

async function postBackend(path: string, params: object): Promise<BackendApiResponse> {
  const url = resolveUrl(path);
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

export const updateConfig = (params: UpdateConfigParams) =>
  postBackend("/update-config", params);

export const updateCourse = (params: UpdateCourseParams) =>
  postBackend("/update-course", params);

export const issueCredential = (params: IssueCredentialParams) =>
  postBackend("/issue-credential", params);

export const upgradeCredential = (params: UpgradeCredentialParams) =>
  postBackend("/upgrade-credential", params);

export const registerMinter = (params: RegisterMinterParams) =>
  postBackend("/register-minter", params);

export const revokeMinter = (params: RevokeMinterParams) =>
  postBackend("/revoke-minter", params);

export const rewardXp = (params: RewardXpParams) =>
  postBackend("/reward-xp", params);

export const createAchievementType = (params: CreateAchievementTypeParams) =>
  postBackend("/create-achievement-type", params);

export const awardAchievement = (params: AwardAchievementParams) =>
  postBackend("/award-achievement", params);

export const deactivateAchievementType = (
  params: DeactivateAchievementTypeParams
) => postBackend("/deactivate-achievement-type", params);
