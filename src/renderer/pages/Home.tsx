import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold">MementoLane</h1>
      <p className="text-muted-foreground">
        Tailwind CSSとshadcn/uiが有効なElectron画面です。
      </p>
      <Button>Click me</Button>
    </div>
  );
}
