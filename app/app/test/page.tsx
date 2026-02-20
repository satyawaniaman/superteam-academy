"use client";

import { Logo } from "@/components/Logo";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import {
  useConfig,
  useAllCourses,
  useEnrollment,
  useXpBalance,
  useEnroll,
  useCloseEnrollment,
  useCreateCourse,
  useCompleteLesson,
  useFinalizeCourse,
} from "@/hooks";
import { countCompletedLessons } from "@/lib/lesson-bitmap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/hooks/useProgram";
import { useState } from "react";

function CopyablePubkey({ value }: { value: string }) {
  return (
    <code className="block break-all font-mono text-sm">{value}</code>
  );
}

function ConfigSection() {
  const { data: config, isLoading, error } = useConfig();
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Config</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading config…</p>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Config</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error: {String(error)}</p>
        </CardContent>
      </Card>
    );
  }
  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Config</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No config (connect wallet).</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Config</CardTitle>
        <CardDescription>Singleton program config PDA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-muted-foreground">Authority</Label>
          <CopyablePubkey value={config.authority.toBase58()} />
        </div>
        <Separator />
        <div>
          <Label className="text-muted-foreground">Backend signer</Label>
          <CopyablePubkey value={config.backendSigner.toBase58()} />
        </div>
        <Separator />
        <div>
          <Label className="text-muted-foreground">XP mint</Label>
          <CopyablePubkey value={config.xpMint.toBase58()} />
        </div>
      </CardContent>
    </Card>
  );
}

function CoursesSection() {
  const { data: courses, isLoading, error } = useAllCourses();
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading courses…</p>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error: {String(error)}</p>
        </CardContent>
      </Card>
    );
  }
  if (!courses?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No courses.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>
          All courses ({courses.length}). Course PDA and account details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course PDA</TableHead>
              <TableHead>Course ID</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>XP/lesson</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => {
              const acc = c.account as {
                courseId: string;
                lessonCount: number;
                xpPerLesson: number;
                isActive: boolean;
              };
              return (
                <TableRow key={c.publicKey.toBase58()}>
                  <TableCell className="font-mono text-xs break-all">
                    {c.publicKey.toBase58()}
                  </TableCell>
                  <TableCell className="font-mono">{acc.courseId}</TableCell>
                  <TableCell>{acc.lessonCount}</TableCell>
                  <TableCell>{acc.xpPerLesson}</TableCell>
                  <TableCell>
                    {acc.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EnrollmentRow({
  courseId,
  lessonCount,
}: {
  courseId: string;
  lessonCount: number;
}) {
  const { data: enrollment, isLoading } = useEnrollment(courseId);
  const { mutate: closeEnrollment, isPending: closing } = useCloseEnrollment();
  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="font-mono">{courseId}</TableCell>
        <TableCell colSpan={4}>Loading…</TableCell>
      </TableRow>
    );
  }
  if (!enrollment) {
    return (
      <TableRow>
        <TableCell className="font-mono">{courseId}</TableCell>
        <TableCell colSpan={4}>—</TableCell>
      </TableRow>
    );
  }
  const acc = enrollment as {
    lessonFlags?: unknown[];
    completedAt?: unknown;
    credentialAsset?: unknown;
  };
  const flags = acc.lessonFlags;
  const completed = flags ? countCompletedLessons(flags) : 0;
  const done = acc.completedAt != null;
  return (
    <TableRow>
      <TableCell className="font-mono">{courseId}</TableCell>
      <TableCell>
        {completed}/{lessonCount}
      </TableCell>
      <TableCell>{done ? "Yes" : "No"}</TableCell>
      <TableCell>{acc.credentialAsset ? "Yes" : "—"}</TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="outline"
          disabled={closing}
          onClick={() => closeEnrollment({ courseId })}
        >
          {closing ? "Closing…" : "Close"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

function LearnerSection() {
  const { publicKey } = useWallet();
  const { data: courses } = useAllCourses();
  const { data: xp } = useXpBalance();
  const { mutate: enroll, isPending: enrolling } = useEnroll();
  const [courseId, setCourseId] = useState("");
  const program = useProgram();

  if (!publicKey || !program) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learner</CardTitle>
          <CardDescription>Wallet-signed actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect wallet for learner actions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const courseOptions = courses ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learner</CardTitle>
        <CardDescription>
          Enroll and close enrollment. Your wallet signs transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>XP balance</Label>
          <p className="font-mono text-lg">{xp ?? "…"}</p>
        </div>
        <Separator />
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2 min-w-[200px]">
            <Label htmlFor="enroll-course">Course to enroll</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger id="enroll-course" className="w-full">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((c) => {
                  const acc = c.account as { courseId: string };
                  return (
                    <SelectItem key={acc.courseId} value={acc.courseId}>
                      {acc.courseId}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={!courseId || enrolling}
            onClick={() => courseId && enroll({ courseId })}
          >
            {enrolling ? "Enrolling…" : "Enroll"}
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>My enrollments</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Finalized</TableHead>
                <TableHead>Credential</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseOptions.map((c) => {
                const acc = c.account as {
                  courseId: string;
                  lessonCount: number;
                };
                return (
                  <EnrollmentRow
                    key={acc.courseId}
                    courseId={acc.courseId}
                    lessonCount={acc.lessonCount}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminApiSection() {
  const [createRes, setCreateRes] = useState<string | null>(null);
  const [completeRes, setCompleteRes] = useState<string | null>(null);
  const [finalizeRes, setFinalizeRes] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    courseId: "test-course-1",
    lessonCount: 3,
    xpPerLesson: 100,
  });
  const [completeForm, setCompleteForm] = useState({
    courseId: "test-course-1",
    learner: "",
    lessonIndex: 0,
  });
  const [finalizeForm, setFinalizeForm] = useState({
    courseId: "test-course-1",
    learner: "",
  });
  const { publicKey } = useWallet();
  const { mutateAsync: createCourse, isPending: creating } = useCreateCourse();
  const { mutateAsync: completeLesson, isPending: completing } = useCompleteLesson();
  const { mutateAsync: finalizeCourse, isPending: finalizing } = useFinalizeCourse();

  const handleCreate = async () => {
    setCreateRes(null);
    try {
      const tx = await createCourse(createForm);
      setCreateRes(`OK: ${tx}`);
    } catch (e) {
      setCreateRes(`Error: ${(e as Error).message}`);
    }
  };
  const handleComplete = async () => {
    setCompleteRes(null);
    const learner = (completeForm.learner || publicKey?.toBase58()) ?? "";
    try {
      const tx = await completeLesson({ ...completeForm, learner });
      setCompleteRes(`OK: ${tx}`);
    } catch (e) {
      setCompleteRes(`Error: ${(e as Error).message}`);
    }
  };
  const handleFinalize = async () => {
    setFinalizeRes(null);
    const learner = (finalizeForm.learner || publicKey?.toBase58()) ?? "";
    try {
      const tx = await finalizeCourse({ ...finalizeForm, learner });
      setFinalizeRes(`OK: ${tx}`);
    } catch (e) {
      setFinalizeRes(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin / Backend (API)</CardTitle>
        <CardDescription>
          Backend-signed transactions. Requires NEXT_PUBLIC_BACKEND_URL and backend
          with ACADEMY_AUTHORITY_KEYPAIR and ACADEMY_BACKEND_SIGNER_KEYPAIR.
          Use courseId from create-course (e.g. test-course-1).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Create course</Label>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="create-courseId">courseId</Label>
              <Input
                id="create-courseId"
                placeholder="courseId"
                value={createForm.courseId}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, courseId: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-lessonCount">lessonCount</Label>
              <Input
                id="create-lessonCount"
                type="number"
                placeholder="lessonCount"
                className="w-24"
                value={createForm.lessonCount}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    lessonCount: +e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-xpPerLesson">xpPerLesson</Label>
              <Input
                id="create-xpPerLesson"
                type="number"
                placeholder="xpPerLesson"
                className="w-24"
                value={createForm.xpPerLesson}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    xpPerLesson: +e.target.value,
                  }))
                }
              />
            </div>
            <Button size="sm" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
          {createRes && (
            <p className="font-mono text-sm break-all">{createRes}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-base font-semibold">Complete lesson</Label>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="complete-courseId">courseId</Label>
              <Input
                id="complete-courseId"
                placeholder="courseId"
                value={completeForm.courseId}
                onChange={(e) =>
                  setCompleteForm((f) => ({ ...f, courseId: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2 min-w-[280px]">
              <Label htmlFor="complete-learner">learner (or leave blank for connected)</Label>
              <Input
                id="complete-learner"
                placeholder="learner pubkey"
                value={completeForm.learner}
                onChange={(e) =>
                  setCompleteForm((f) => ({ ...f, learner: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complete-lessonIndex">lessonIndex</Label>
              <Input
                id="complete-lessonIndex"
                type="number"
                placeholder="0"
                className="w-24"
                value={completeForm.lessonIndex}
                onChange={(e) =>
                  setCompleteForm((f) => ({
                    ...f,
                    lessonIndex: +e.target.value,
                  }))
                }
              />
            </div>
            <Button size="sm" onClick={handleComplete} disabled={completing}>
              {completing ? "Completing…" : "Complete"}
            </Button>
          </div>
          {completeRes && (
            <p className="font-mono text-sm break-all">{completeRes}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-base font-semibold">Finalize course</Label>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="finalize-courseId">courseId</Label>
              <Input
                id="finalize-courseId"
                placeholder="courseId"
                value={finalizeForm.courseId}
                onChange={(e) =>
                  setFinalizeForm((f) => ({ ...f, courseId: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2 min-w-[280px]">
              <Label htmlFor="finalize-learner">learner (or leave blank for connected)</Label>
              <Input
                id="finalize-learner"
                placeholder="learner pubkey"
                value={finalizeForm.learner}
                onChange={(e) =>
                  setFinalizeForm((f) => ({ ...f, learner: e.target.value }))
                }
              />
            </div>
            <Button size="sm" onClick={handleFinalize} disabled={finalizing}>
              {finalizing ? "Finalizing…" : "Finalize"}
            </Button>
          </div>
          {finalizeRes && (
            <p className="font-mono text-sm break-all">{finalizeRes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestPage() {
  const { connected, publicKey } = useWallet();
  const program = useProgram();
  const programId = program?.programId ?? null;

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-6">
          <Logo />
          <Badge variant="outline">/test</Badge>
        </div>
        <WalletConnectButton />
      </header>
      <main className="mx-auto max-w-5xl space-y-8 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Academy Test</CardTitle>
            <CardDescription>
              Devnet test page. All instructions and data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Program ID</Label>
              <CopyablePubkey
                value={programId?.toBase58() ?? "—"}
              />
            </div>
            <Separator />
            <div>
              <Label className="text-muted-foreground">Wallet</Label>
              <p className="font-mono text-sm">
                {connected && publicKey
                  ? publicKey.toBase58()
                  : "Disconnected"}
              </p>
            </div>
          </CardContent>
        </Card>

        <ConfigSection />
        <CoursesSection />
        <LearnerSection />
        <AdminApiSection />
      </main>
    </div>
  );
}
