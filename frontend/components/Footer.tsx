export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-white/5 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-muted text-sm text-center">
          &copy; {new Date().getFullYear()} PixelCrypt. For educational purposes.
        </p>
      </div>
    </footer>
  );
}
