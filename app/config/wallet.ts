import { clusterApiUrl, type Cluster } from "@solana/web3.js";

/**
 * Solana RPC endpoint for wallet adapter and chain reads.
 * Set NEXT_PUBLIC_SOLANA_RPC to override (e.g. Helius); otherwise uses public cluster URL.
 */
const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster | undefined;
export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(cluster ?? "devnet");
