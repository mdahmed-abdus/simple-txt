import { Separator } from './ui/separator';
import ExternalLink from './ExternalLink';

export default function About() {
  return (
    <div className="container mt-32 font-thin text-center" id="about">
      <p>simple-txt is a minimalistic app designed for taking notes.</p>
      <p className="mt-4">This project was created as part of my portfolio.</p>
      <p>Feel free to reach out if you have any questions.</p>
      <div className="mt-16 flex h-5 space-x-4 items-center justify-center text-sm">
        <ExternalLink text="Email" href="mailto:mdahmed.abdus@gmail.com" />
        <Separator className="" orientation="vertical" decorative />
        <ExternalLink
          text="Twitter / X"
          href="https://twitter.com/mdahmed_abdus"
        />
        <Separator orientation="vertical" />
        <ExternalLink
          text="LinkedIn"
          href="https://www.linkedin.com/in/mdahmed-abdus/"
        />
      </div>
      <div className="mt-4 text-sm">
        <ExternalLink
          text="Source code"
          href="https://github.com/mdahmed-abdus"
        />
      </div>
    </div>
  );
}
