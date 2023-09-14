import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function ExternalLink({
  className = '',
  text,
  href,
  target = '_blank',
  rel = '',
}: {
  className?: string;
  text: string;
  href: string;
  target?: string;
  rel?: string;
}) {
  if (target === '_blank') {
    rel = 'noopener noreferrer';
  }

  return (
    <Button className="p-0" variant="link" asChild>
      <a
        className={cn('font-thin', className)}
        href={href}
        target={target}
        rel={rel}
      >
        {text}
      </a>
    </Button>
  );
}
