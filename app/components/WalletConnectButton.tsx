"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WalletConnectButton() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const label =
    connected && publicKey
      ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
      : "Connect wallet";

  if (connected) {
    return (
      <div ref={ref} className="relative">
        <Button
          variant="default"
          size="default"
          onClick={() => setOpen((o) => !o)}
          className="min-w-[140px] truncate"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {label}
        </Button>
        {open && (
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-border bg-popover py-1 shadow-md"
            )}
          >
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => {
                setOpen(false);
                setVisible(true);
              }}
            >
              Change wallet
            </button>
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => {
                setOpen(false);
                disconnect();
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="default"
      size="default"
      onClick={() => setVisible(true)}
      className="min-w-[140px]"
    >
      {label}
    </Button>
  );
}
