import Link from 'next/link';
import { Button } from './button';
import { cn } from '@/lib/utils';

export default function InternalLink({
  className,
  text,
  href,
}: {
  className?: string;
  text: string;
  href: string;
}) {
  return (
    <Button
      className={cn('p-0 h-fit font-thin text-base', className)}
      variant="link"
      asChild
    >
      <Link href={href}>{text}</Link>
    </Button>
  );
}
