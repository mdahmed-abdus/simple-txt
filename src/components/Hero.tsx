export default function Hero() {
  return (
    <div className="mt-32 mb-32 font-thin text-center">
      <h1 className="text-6xl">simple-txt</h1>
      <p className="mt-4 text-lg">A simple note taking app.</p>
      <p className="mt-8 text-primary text-sm text-center">
        Designed and developed by @
        <a
          className="hover:text-destructive hover:underline"
          href="https://github.com/mdahmed-abdus"
          target="_blank"
        >
          mdahmed-abdus
        </a>
      </p>
    </div>
  );
}
