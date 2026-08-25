export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-white/5 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted text-sm">
          &copy; {new Date().getFullYear()} PixelCrypt. For educational purposes.
        </p>
        <div className="flex space-x-6 text-sm">
          <span className="text-muted/60 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse"></span>
            Systems Online
          </span>
        </div>
      </div>
    </footer>
  );
}
