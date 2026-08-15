import Link from "next/link";
import RecordButton from "@/components/RecordButton";

export default function RecordPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          ← Back to map
        </Link>
        <h1 className="text-lg font-semibold">Record a cleanup</h1>
        <span className="w-16" />
      </header>
      <RecordButton />
    </div>
  );
}
