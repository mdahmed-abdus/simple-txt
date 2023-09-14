import Link from 'next/link';

export default function Navbar() {
  const navLinkClassName = 'hover:underline';

  return (
    <nav className="py-4 flex justify-between font-thin">
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
        <li>
          <Link className={navLinkClassName} href="/login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
