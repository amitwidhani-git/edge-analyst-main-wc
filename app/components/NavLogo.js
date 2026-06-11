import Link from 'next/link';

export default function NavLogo() {
  return (
    <Link className="nav-logo" href="/">
      <svg className="nav-logo-icon" width="30" height="28" viewBox="1 -1 62 58" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ea-iri" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#C8FF00">
              <animate attributeName="stopColor" values="#C8FF00;#4A7FD4;#1853B4;#C8FF00" dur="4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#4A7FD4">
              <animate attributeName="stopColor" values="#4A7FD4;#1853B4;#C8FF00;#4A7FD4" dur="4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#1853B4">
              <animate attributeName="stopColor" values="#1853B4;#C8FF00;#4A7FD4;#1853B4" dur="4s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        <path d="M4 22 L32 2 L60 22" stroke="url(#ea-iri)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
        <path d="M4 38 L32 18 L60 38" stroke="url(#ea-iri)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
        <path d="M4 54 L32 34 L60 54" stroke="url(#ea-iri)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span className="nav-word">Edge Analysts</span>
        <span className="nav-strapline">We have the data so you can have the edge</span>
      </div>
    </Link>
  );
}
