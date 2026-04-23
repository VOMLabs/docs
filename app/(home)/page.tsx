export default function HomePage() {
  return (
    <div className="mt-12 rounded-2xl border bg-background overflow-hidden">
      <div className="grid md:grid-cols-12">
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-6">
          <div className="text-sm font-medium">Quick links</div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Jump straight into the docs or browse the install guide.
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
          <div className="text-sm font-medium">Design goals</div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            A unified shell with a shared header/footer, a marketing-heavy home
            hero, and a functional docs grid with a sticky, nested sidebar.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border p-4">
              <div className="font-medium">Seamless transitions</div>
              <div className="mt-1 text-fd-muted-foreground">
                Same header and footer across both modes.
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-medium">Minimalist, border-heavy</div>
              <div className="mt-1 text-fd-muted-foreground">
                Clean surfaces with strong layout structure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}