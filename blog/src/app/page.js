import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="home">
      <h1 className="home__title">블로그</h1>
      <section>
        <h2 className="home__section-title">글 목록</h2>
        <ul className="home__list">
          {allPostsData.map(({ id, date, title }) => (
            <li key={id} className="home__item">
              <Link href={`/posts/${id}`} className="home__link">
                {title}
              </Link>
              <small className="home__date">{date}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
