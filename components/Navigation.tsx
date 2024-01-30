import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/drawing-with-hand">Drawing with Hand</Link>
        </li>
      </ul>
    </nav>
  );
}
