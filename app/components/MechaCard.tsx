export default function MechaCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 170 105" className="absolute -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,1 160,1 169,10 169,95 160,104 10,104 1,95 1,10" fill="none" stroke="#e500ff" strokeWidth="0.8" opacity="0.35" />
          <line x1="1" y1="10" x2="10" y2="1" stroke="#e500ff" strokeWidth="1.2" opacity="0.5" />
          <line x1="160" y1="1" x2="169" y2="10" stroke="#e500ff" strokeWidth="1.2" opacity="0.5" />
        </svg>
        {children}
      </div>
    );
  }