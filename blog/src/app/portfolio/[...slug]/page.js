import Link from 'next/link';
import { getPortfolioData, getAllPortfolioSlugs } from '../../../lib/portfolios';

// 정적 경로 생성 (catch-all)
export async function generateStaticParams() {
  const allSlugs = getAllPortfolioSlugs();
  return allSlugs.map(({ slug }) => ({
    slug,
  }));
}

export default async function PortfolioDetail({ params }) {
  const resolvedParams = await params;
  const data = await getPortfolioData(resolvedParams.slug);

  return (
    <article className="portfolio-detail">
      <header className="portfolio-detail__header">
        {data.category && (
          <span className="portfolio-detail__category">{data.category}</span>
        )}
        <h1 className="portfolio-detail__title">{data.title}</h1>
        <div className="portfolio-detail__date">{data.date}</div>
      </header>

      <div
        className="portfolio-detail__content"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      />

      <div>
        <Link href="/portfolio" className="portfolio-detail__back">
          ← 포트폴리오 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
