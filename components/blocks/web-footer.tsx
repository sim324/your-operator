export default function WebFooter() {
  return (
    <header className="w-full flex min-h-16">
      <div className="flex flex-row items-center justify-between mx-auto max-w-7xl  py-4 px-4 sm:px-6 lg:px-8 w-full">
        <span className="text-muted-foreground">
          © {new Date().getFullYear()} Your Operator
        </span>
      </div>
    </header>
  );
}
