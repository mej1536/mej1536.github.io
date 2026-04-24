import Link from 'next/link';
import { getPostData, getAllPostSlugs } from '../../../lib/posts';

// 정적 경로 생성 (catch-all)
export async function generateStaticParams() {
  const allSlugs = getAllPostSlugs();
  return allSlugs.map(({ slug }) => ({
    slug,
  }));
}

export default async function PostDetail({ params }) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.slug);

  return (
    <article className="post">
      <header className="post__header">
        {postData.category && (
          <span className="post__category">{postData.category}</span>
        )}
        <h1 className="post__title">{postData.title}</h1>
        <div className="post__date">{postData.date}</div>
      </header>

      {/* 마크다운 본문이 HTML로 변환되어 들어갈 자리 */}
      <div
        className="post__content"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />

      <div>
        <Link href="/" className="post__back">
          ← 전체 글 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
