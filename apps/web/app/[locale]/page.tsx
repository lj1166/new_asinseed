import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>ASINSeed — Stage 0 scaffold</CardTitle>
          <CardDescription>Locale: {locale}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Next.js + Tailwind + shadcn/ui + design tokens are wired up. Real page migration starts in Stage 1.
          </p>
          <Button>Placeholder CTA</Button>
        </CardContent>
      </Card>
    </main>
  );
}
