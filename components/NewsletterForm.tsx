"use client";

import { useState } from "react";
import { useToast } from "@/store/toast";

// Footer newsletter signup. There's no backend in this assignment, so on submit
// we just confirm with a toast (reusing the global toast system) and clear the
// field — enough to feel real and show the interaction.
export default function NewsletterForm() {
  const show = useToast((s) => s.show);
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        show("Thanks for subscribing! 🎉", "pink");
        setEmail("");
      }}
      className="flex max-w-sm gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Email address"
        className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm text-paper outline-none ring-1 ring-inset ring-white/20 transition-shadow placeholder:text-paper/50 focus:ring-2 focus:ring-white/60"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-pop-plum transition-transform duration-150 hover:-translate-y-0.5"
      >
        Join
      </button>
    </form>
  );
}
