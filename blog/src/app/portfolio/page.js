import Link from 'next/link';
import { getSortedPortfoliosData } from '../../lib/portfolios';

export default function PortfolioPage() {
  const allPortfolios = getSortedPortfoliosData();

  return (
    <>
      <h1 className="portfolio__title">포트폴리오</h1>
      <ul className="portfolio__list">
        {allPortfolios.map(({ slug, title, date, description, category }) => (
          <li key={slug.join('/')} className="portfolio__item">
            <Link href={`/portfolio/${slug.join('/')}`} className="portfolio__link">
              {title}
            </Link>
            {description && (
              <p className="portfolio__description">{description}</p>
            )}
            <small className="portfolio__date">{date}</small>
          </li>
        ))}
      </ul>
    </>
  );
}
