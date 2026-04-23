export default function HomePage() {
  return (
    <div className="mt-12 rounded-2xl border bg-background overflow-hidden">
      <div className="grid md:grid-cols-12">
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-6">
          <div className="text-sm font-medium">Quick links</div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Explore our docs or start with the install guide.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <a
              href="/docs"
              className="rounded-md border px-3 py-2 hover:bg-fd-muted transition-colors"
            >
              Documentation index
            </a>
            <a
              href="/docs/install-minecraft-plugin"
              className="rounded-md border px-3 py-2 hover:bg-fd-muted transition-colors"
            >
              Install Minecraft plugin
            </a>
          </div>
        </div>
        <div className="md:col-span-8 p-6">
          <div className="text-sm font-medium">What we do</div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            We make and release tools like Minecraft plugins we use ourselves, but also share projects built just for the public.
          </p>
        </div>
      </div>
    </div>
  );
}