import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__logo">
        블로그
      </Link>
      <nav>
        <ul className="header__nav">
          <li>
            <Link href="/" className="header__link">
              홈
            </Link>
          </li>
          <li>
            <Link href="/" className="header__link">
              블로그
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="header__link">
              포트폴리오
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
