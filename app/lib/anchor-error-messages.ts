const ERROR_MESSAGES: Record<string, string> = {
  CourseNotActive: "This course is no longer active.",
  LessonOutOfBounds: "Invalid lesson.",
  LessonAlreadyCompleted: "Lesson already completed.",
  CourseNotCompleted: "Complete all lessons before finalizing.",
  CourseAlreadyFinalized: "Course already finalized.",
  CourseNotFinalized: "Finalize the course first.",
  PrerequisiteNotMet: "Complete the prerequisite course first.",
  UnenrollCooldown: "Wait 24 hours after enrolling to unenroll.",
  MinterNotActive: "Minter is no longer active.",
  MinterAmountExceeded: "XP reward exceeds limit.",
  AchievementNotActive: "This achievement is no longer active.",
  AchievementSupplyExhausted: "Achievement supply exhausted.",
  InvalidAmount: "Invalid amount.",
  Unauthorized: "You are not authorized for this action.",
  EnrollmentCourseMismatch: "Enrollment does not match course.",
  Overflow: "Numerical overflow.",
};

export function getAnchorErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "Transaction failed.";
}
