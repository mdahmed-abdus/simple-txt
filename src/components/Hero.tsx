import ExternalLink from './ExternalLink';

export default function Hero() {
  return (
    <div className="mt-16 md:mt-32 font-thin text-center">
      <h1 className="text-6xl">simple-txt</h1>
      <p className="mt-4 text-lg">A simple note taking app.</p>
      <p className="mt-16 text-primary text-sm">
        Designed and developed by @
        <ExternalLink
          text="mdahmed-abdus"
          href="https://github.com/mdahmed-abdus"
        />
      </p>
    </div>
  );
}
