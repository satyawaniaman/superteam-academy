import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/HORIZONTAL-LOGO/ST-DARK-GREEN-HORIZONTAL.png";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center no-underline hover:opacity-90"
      aria-label="Superteam Brasil — Início"
    >
      <Image
        src={LOGO_SRC}
        alt="Superteam Brasil"
        width={180}
        height={40}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}
