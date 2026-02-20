import { Logo } from "@/components/Logo";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <Logo />
        <WalletConnectButton />
      </header>
      <main className="flex-1 p-4">
      </main>
    </div>
  );
}
