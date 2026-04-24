import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>내 넥스트제이에스 블로그</h1>
      <section>
        <h2 style={{ fontSize: '1.5rem', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          블로그 글 목록
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem' }}>
              <Link href={`/posts/${id}`} style={{ textDecoration: 'none', color: '#0070f3', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {title}
              </Link>
              <br />
              <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
