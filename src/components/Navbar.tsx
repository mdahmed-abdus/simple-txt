import Link from 'next/link';

export default function Navbar() {
  const navLinkClassName = 'hover:text-destructive';

  return (
    <nav className="container py-4 flex justify-between font-thin">
      <div>
        <Link className={navLinkClassName} href="/">
          simple-txt
        </Link>
      </div>
      <ul className="flex gap-8">
        <li>
          <Link className={navLinkClassName} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className={navLinkClassName} href="#about">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
