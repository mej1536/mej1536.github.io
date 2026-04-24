import Link from 'next/link';

export default function PortfolioLayout({ children }) {
  return (
    <div className="portfolio">
      <nav className="portfolio__nav">
        <ul className="portfolio__nav-list">
          <li>
            <Link href="/portfolio" className="portfolio__nav-link">
              전체
            </Link>
          </li>
          {/* 필요에 따라 분류 메뉴를 추가하세요 */}
        </ul>
      </nav>
      <div className="portfolio__content">
        {children}
      </div>
    </div>
  );
}
