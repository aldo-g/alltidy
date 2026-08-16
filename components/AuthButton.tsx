"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDeviceId } from "@/lib/deviceId";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN") {
        fetch("/api/claim-activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id: getDeviceId() }),
        }).catch(() => {
          // Best-effort: if claiming fails the user just keeps their
          // existing personal stats and can retry by signing out/in.
        });
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--surface-muted)]" />;
  }

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const label = (user.user_metadata?.name as string | undefined) ?? user.email ?? "Account";

    return (
      <button
        onClick={handleSignOut}
        title={`Signed in as ${label} — click to sign out`}
        className="glass-panel flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105 active:scale-95"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-xs font-semibold">
            {label.charAt(0).toUpperCase()}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="glass-panel rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-muted)]"
    >
      Sign in
    </button>
  );
}
