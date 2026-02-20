import { PublicKey } from "@solana/web3.js";

export function getConfigPda(programId: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    programId
  );
  return pda;
}

export function getCoursePda(
  courseId: string,
  programId: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("course"), Buffer.from(courseId)],
    programId
  );
  return pda;
}

export function getEnrollmentPda(
  courseId: string,
  learner: PublicKey,
  programId: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("enrollment"), Buffer.from(courseId), learner.toBuffer()],
    programId
  );
  return pda;
}

export function getMinterRolePda(
  minter: PublicKey,
  programId: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("minter"), minter.toBuffer()],
    programId
  );
  return pda;
}

export function getAchievementTypePda(
  achievementId: string,
  programId: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("achievement"), Buffer.from(achievementId)],
    programId
  );
  return pda;
}

export function getAchievementReceiptPda(
  achievementId: string,
  recipient: PublicKey,
  programId: PublicKey
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("achievement_receipt"),
      Buffer.from(achievementId),
      recipient.toBuffer(),
    ],
    programId
  );
  return pda;
}
