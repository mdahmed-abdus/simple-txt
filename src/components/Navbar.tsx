import InternalLink from './ui/InternalLink';

export default function Navbar() {
  return (
    <nav className="py-4 flex justify-between font-thin">
      <div>
        <InternalLink text="simple-txt" href="/" />
      </div>
      <ul className="flex gap-8">
        <li>
          <InternalLink className="text-sm" text="Home" href="/" />
        </li>
        <li>
          <InternalLink className="text-sm" text="About" href="/#about" />
        </li>
        <li>
          <InternalLink className="text-sm" text="Login" href="/login" />
        </li>
      </ul>
    </nav>
  );
}
