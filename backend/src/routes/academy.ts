import { Hono } from "hono";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { getAuthorityProgram, getBackendProgram } from "../program.js";
import {
  getConfigPda,
  getCoursePda,
  getEnrollmentPda,
} from "../pdas.js";

const app = new Hono();

app.post("/create-course", async (c) => {
  try {
    const program = getAuthorityProgram();
    if (!program) {
      return c.json(
        { error: "ACADEMY_AUTHORITY_KEYPAIR not configured" },
        500
      );
    }
    const body = await c.req.json<{
      courseId?: string;
      lessonCount?: number;
      xpPerLesson?: number;
      creator?: string;
    }>();
    const {
      courseId = "test-course-1",
      lessonCount = 3,
      xpPerLesson = 100,
      creator,
    } = body;
    const configPda = getConfigPda(program.programId);
    const coursePda = getCoursePda(courseId, program.programId);
    const creatorPubkey = creator
      ? new PublicKey(creator)
      : program.provider.publicKey!;
    const contentTxId = new Array<number>(32).fill(0);
    const tx = await (
      program.methods as unknown as {
        createCourse: (args: {
          courseId: string;
          creator: PublicKey;
          contentTxId: number[];
          lessonCount: number;
          difficulty: number;
          xpPerLesson: number;
          trackId: number;
          trackLevel: number;
          prerequisite: null;
          creatorRewardXp: number;
          minCompletionsForReward: number;
        }) => {
          accountsPartial: (accs: Record<string, PublicKey>) => {
            rpc: () => Promise<string>;
          };
        }
      }
    )
      .createCourse({
        courseId,
        creator: creatorPubkey,
        contentTxId,
        lessonCount,
        difficulty: 1,
        xpPerLesson,
        trackId: 1,
        trackLevel: 1,
        prerequisite: null,
        creatorRewardXp: 50,
        minCompletionsForReward: 3,
      })
      .accountsPartial({
        course: coursePda,
        config: configPda,
        authority: program.provider.publicKey!,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    return c.json({ tx });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post("/complete-lesson", async (c) => {
  try {
    const program = getBackendProgram();
    if (!program) {
      return c.json(
        { error: "ACADEMY_BACKEND_SIGNER_KEYPAIR not configured" },
        500
      );
    }
    const body = await c.req.json<{
      courseId?: string;
      learner: string;
      lessonIndex?: number;
    }>();
    const { courseId = "test-course-1", learner, lessonIndex = 0 } = body;
    const learnerPubkey = new PublicKey(learner);
    const configPda = getConfigPda(program.programId);
    const config = await (
      program.account as {
        config: {
          fetch: (p: PublicKey) => Promise<{ xpMint: PublicKey }>;
        };
      }
    ).config.fetch(configPda);
    const coursePda = getCoursePda(courseId, program.programId);
    try {
      await (
        program.account as { course: { fetch: (p: PublicKey) => Promise<unknown> } }
      ).course.fetch(coursePda);
    } catch (e) {
      const msg = String(e);
      if (msg.includes("Account does not exist") || msg.includes("could not find account")) {
        return c.json(
          { error: `Course "${courseId}" not found. Create it first via create-course.` },
          400
        );
      }
      throw e;
    }
    const enrollmentPda = getEnrollmentPda(
      courseId,
      learnerPubkey,
      program.programId
    );
    const xpAta = getAssociatedTokenAddressSync(
      config.xpMint,
      learnerPubkey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      await program.provider.connection.getTokenAccountBalance(xpAta);
    } catch {
      const { Transaction } = await import("@solana/web3.js");
      const ix = createAssociatedTokenAccountInstruction(
        program.provider.publicKey!,
        xpAta,
        learnerPubkey,
        config.xpMint,
        TOKEN_2022_PROGRAM_ID
      );
      const tx = new Transaction().add(ix);
      await program.provider.sendAndConfirm!(tx);
    }
    const tx = await (
      program.methods as unknown as {
        completeLesson: (idx: number) => {
          accountsPartial: (accs: Record<string, PublicKey>) => {
            rpc: () => Promise<string>;
          };
        };
      }
    )
      .completeLesson(lessonIndex)
      .accountsPartial({
        config: configPda,
        course: coursePda,
        enrollment: enrollmentPda,
        learner: learnerPubkey,
        learnerTokenAccount: xpAta,
        xpMint: config.xpMint,
        backendSigner: program.provider.publicKey!,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();
    return c.json({ tx });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.post("/finalize-course", async (c) => {
  try {
    const program = getBackendProgram();
    if (!program) {
      return c.json(
        { error: "ACADEMY_BACKEND_SIGNER_KEYPAIR not configured" },
        500
      );
    }
    const body = await c.req.json<{
      courseId?: string;
      learner: string;
    }>();
    const { courseId = "test-course-1", learner } = body;
    const learnerPubkey = new PublicKey(learner);
    const configPda = getConfigPda(program.programId);
    const config = await (
      program.account as {
        config: {
          fetch: (p: PublicKey) => Promise<{ xpMint: PublicKey }>;
        };
      }
    ).config.fetch(configPda);
    const coursePda = getCoursePda(courseId, program.programId);
    let course: { creator: PublicKey };
    try {
      course = await (
        program.account as {
          course: {
            fetch: (p: PublicKey) => Promise<{ creator: PublicKey }>;
          };
        }
      ).course.fetch(coursePda);
    } catch (e) {
      const msg = String(e);
      if (msg.includes("Account does not exist") || msg.includes("could not find account")) {
        return c.json(
          {
            error: `Course "${courseId}" not found. Create it first via POST /academy/create-course.`,
          },
          400
        );
      }
      throw e;
    }
    const enrollmentPda = getEnrollmentPda(
      courseId,
      learnerPubkey,
      program.programId
    );
    const learnerXpAta = getAssociatedTokenAddressSync(
      config.xpMint,
      learnerPubkey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    const creatorXpAta = getAssociatedTokenAddressSync(
      config.xpMint,
      course.creator,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      await program.provider.connection.getTokenAccountBalance(creatorXpAta);
    } catch {
      const { Transaction } = await import("@solana/web3.js");
      const ix = createAssociatedTokenAccountInstruction(
        program.provider.publicKey!,
        creatorXpAta,
        course.creator,
        config.xpMint,
        TOKEN_2022_PROGRAM_ID
      );
      const setupTx = new Transaction().add(ix);
      await program.provider.sendAndConfirm!(setupTx);
    }
    const tx = await (
      program.methods as unknown as {
        finalizeCourse: () => {
          accountsPartial: (accs: Record<string, PublicKey>) => {
            rpc: () => Promise<string>;
          };
        };
      }
    )
      .finalizeCourse()
      .accountsPartial({
        config: configPda,
        course: coursePda,
        enrollment: enrollmentPda,
        learner: learnerPubkey,
        learnerTokenAccount: learnerXpAta,
        creatorTokenAccount: creatorXpAta,
        creator: course.creator,
        xpMint: config.xpMint,
        backendSigner: program.provider.publicKey!,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();
    return c.json({ tx });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

export default app;
