// Static footer — a bold color block that closes the page. Purely presentational,
// so it stays a Server Component and ships zero client JS.
export default function Footer() {
  return (
    <footer className="mt-20 bg-pop-forest text-paper">
      <div className="wrap py-14">
        <p className="font-display text-5xl font-extrabold sm:text-7xl">
          Nat Habit
        </p>
        <p className="mt-3 max-w-md text-lg text-paper/70">
          Natural products, discovered simply.
        </p>
        <div className="mt-10 flex flex-col gap-2 border-t border-paper/20 pt-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nat Habit. Built for the frontend assignment.</p>
          <p>Data from DummyJSON · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
