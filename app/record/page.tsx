import Link from "next/link";
import RecordButton from "@/components/RecordButton";

export default function RecordPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col bg-[var(--background)]">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center p-4">
        <Link
          href="/"
          className="glass-panel pointer-events-auto absolute left-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Map
        </Link>
        <h1 className="glass-panel font-display rounded-full px-4 py-2 text-sm font-semibold">
          Record a cleanup
        </h1>
      </header>
      <RecordButton />
    </div>
  );
}
