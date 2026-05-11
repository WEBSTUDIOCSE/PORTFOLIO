// Site footer — colophon + legal disclaimer for company logos used
// in the Experience section. Minimal by design: this is the
// "house-keeping shelf" of the page, not a navigational element.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          © {year} Saurabh Jadhav · Made with{" "}
          <span className="font-hand text-base text-primary">love</span> in Mumbai
        </p>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          All company logos are property of their respective owners.
        </p>
      </div>
    </footer>
  );
}
