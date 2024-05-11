'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navigation">
      <ul>
        {pathname !== '/' && (
          <li>
            <Link href="/">Home</Link>
          </li>
        )}
        {pathname === '/' && (
          <>
            {/* <li>
              <Link href="/pinch-circles">Pinch Circles</Link>
            </li>
            <li>
              <Link href="/drawing-with-hand">Drawing with Hand</Link>
            </li> */}
            <li>
              <Link href="/shaking-rainbow">Shaking Rainbow</Link>
              <Image
                className="arrow-icon"
                src={`/images/arrow.svg`}
                alt={'arrow icon'}
                width="20"
                height="20"
              />
            </li>
            <li>
              <Link href="/bubble-bubble">Bubble Bubble</Link>
              <Image
                className="arrow-icon"
                src={`/images/arrow.svg`}
                alt={'arrow icon'}
                width="20"
                height="20"
              />
            </li>
            <li>
              <Link href="/catch-balls">Catch balls</Link>
              <Image
                className="arrow-icon"
                src={`/images/arrow.svg`}
                alt={'arrow icon'}
                width="20"
                height="20"
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
