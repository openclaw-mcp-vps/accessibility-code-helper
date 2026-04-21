"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UnlockForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Unable to unlock your subscription.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Network error while checking subscription. Try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUnlock} className="space-y-3">
      <label className="block text-sm text-[#b7c8e0]" htmlFor="email">
        Email used at checkout
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-md border border-[#2f4561] bg-[#0f1828] px-3 py-2 text-[#edf4ff] outline-none focus:border-[#58c4dd]"
        placeholder="you@company.com"
      />
      {error ? <p className="text-sm text-[#f5a6b6]">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Validating subscription..." : "Unlock Dashboard"}
      </Button>
    </form>
  );
}
