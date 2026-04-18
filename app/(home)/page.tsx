import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        VOMLabs Documentation
      </h1>
      <p className="text-lg md:text-xl text-fd-muted-foreground max-w-2xl mb-10">
        Learn how to install and configure Minecraft plugins for your server.
        Step-by-step guides with practical examples.
      </p>
      <Link
        href="/docs"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 h-10 px-6"
      >
        Get Started
      </Link>
    </div>
  );
}