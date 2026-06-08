// Static footer — purely presentational, so it stays a Server Component and
// ships zero client JS.
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-border bg-brand-cream">
      <div className="wrap flex flex-col gap-2 py-8 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Nat Habit. Built for the frontend assignment.</p>
        <p>Data from DummyJSON · Built with Next.js</p>
      </div>
    </footer>
  );
}
