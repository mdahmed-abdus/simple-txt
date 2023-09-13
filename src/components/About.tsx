import { Separator } from './ui/separator';

export default function About() {
  return (
    <div className="container mt-32 font-thin text-center" id="about">
      <p>simple-txt is a minimalistic app designed for taking notes.</p>
      <p className="mt-4">This project was created as part of my portfolio.</p>
      <p>Feel free to reach out if you have any questions.</p>
      <div className="mt-16 flex h-5 space-x-4 items-center justify-center text-sm">
        <a
          className="hover:underline"
          href="mailto:mdahmed.abdus@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email
        </a>
        <Separator className="" orientation="vertical" decorative />
        <a
          className="hover:underline"
          href="https://twitter.com/mdahmed_abdus"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter / X
        </a>
        <Separator orientation="vertical" />
        <a
          className="hover:underline"
          href="https://www.linkedin.com/in/mdahmed-abdus/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
      <div className="mt-4 text-sm">
        <a
          className="hover:underline"
          href="https://github.com/mdahmed-abdus"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </div>
    </div>
  );
}
