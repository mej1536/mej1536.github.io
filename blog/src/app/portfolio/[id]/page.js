import Link from 'next/link';
import { getPortfolioData, getAllPortfolioIds } from '../../../lib/portfolios';

// 정적 경로 생성
export async function generateStaticParams() {
  const paths = getAllPortfolioIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function PortfolioDetail({ params }) {
  const resolvedParams = await params;
  const data = await getPortfolioData(resolvedParams.id);

  return (
    <article className="portfolio-detail">
      <header className="portfolio-detail__header">
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
