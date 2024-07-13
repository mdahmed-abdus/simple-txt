import { Separator } from './ui/separator';
import ExternalLink from './ExternalLink';
import InternalLink from './ui/InternalLink';

export default function About() {
  return (
    <div className="container mt-32 font-thin text-center" id="about">
      <p>simple-txt is a minimalistic app designed for taking notes.</p>
      <p className="mt-4">This project was created as part of my portfolio.</p>
      <p>Feel free to reach out if you have any questions.</p>
      <div className="mt-16 flex h-5 space-x-4 items-center justify-center text-sm">
        <ExternalLink text="Email" href="mailto:mdahmed.abdus@gmail.com" />
        <Separator orientation="vertical" decorative />
        <ExternalLink
          text="LinkedIn"
          href="https://www.linkedin.com/in/mdahmed-abdus/"
        />
      </div>
      <div className="mt-4">
        <ExternalLink
          text="Source code"
          href="https://github.com/mdahmed-abdus/simple-txt"
        />
        <br />
        <InternalLink
          className="text-sm"
          href="/credits"
          text="Credits / Attribution"
        />
      </div>
    </div>
  );
}
