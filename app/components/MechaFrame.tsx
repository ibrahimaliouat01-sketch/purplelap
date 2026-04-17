export default function MechaFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 480 280" className="absolute -top-2.5 -left-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,2 460,2 478,20 478,260 460,278 20,278 2,260 2,20" fill="none" stroke="#e500ff" strokeWidth="1" opacity="0.4" />
          <polygon points="25,6 455,6 472,22 472,256 455,272 25,272 8,256 8,22" fill="none" stroke="#e500ff" strokeWidth="0.5" opacity="0.15" />
          <line x1="2" y1="20" x2="20" y2="2" stroke="#e500ff" strokeWidth="1.5" opacity="0.6" />
          <line x1="460" y1="2" x2="478" y2="20" stroke="#e500ff" strokeWidth="1.5" opacity="0.6" />
          <line x1="478" y1="260" x2="460" y2="278" stroke="#e500ff" strokeWidth="1.5" opacity="0.6" />
          <line x1="20" y1="278" x2="2" y2="260" stroke="#e500ff" strokeWidth="1.5" opacity="0.6" />
        </svg>
        {children}
      </div>
    );
  }