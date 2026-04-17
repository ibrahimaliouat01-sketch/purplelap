export default function Footer() {
    return (
      <footer className="border-t border-purple-primary/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-gray font-mono">
          <p>&copy; {new Date().getFullYear()} purple<span className="text-purple-primary">Lap</span>. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-primary transition-colors duration-200">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-primary transition-colors duration-200">YouTube</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-primary transition-colors duration-200">X</a>
          </div>
        </div>
      </footer>
    );
  }