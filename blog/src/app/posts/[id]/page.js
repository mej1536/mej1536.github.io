import { getPostData, getAllPostIds } from '../../../lib/posts';
import Link from 'next/link';

// 깃허브 배포(정적 내보내기)를 위해 필요한 동적 경로 생성 함수
export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }) {
  // 최신 Next.js 환경에서는 params가 비동기(Promise)일 수 있으므로 await를 사용합니다.
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eaeaea' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{postData.title}</h1>
        <div style={{ color: '#666' }}>{postData.date}</div>
      </header>
      
      {/* 마크다운 본문이 HTML로 변환되어 들어갈 자리 */}
      <div 
        style={{ lineHeight: '1.6', fontSize: '1.1rem' }}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eaeaea' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← 전체 글 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
