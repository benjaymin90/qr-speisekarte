import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, QrCode, Smartphone, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              QR-Speisekarte
            </h1>
          </div>

          <p className="text-lg text-muted-foreground">
            Digitale Speisekarte per QR-Code — einfach, modern und
            DSGVO-konform. Perfekt für die deutsche Gastronomie.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/admin">Jetzt starten</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/m/demo">Demo ansehen</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">QR-Code</h3>
            <p className="text-sm text-muted-foreground">
              Generiere QR-Codes für jeden Tisch. Gäste scannen und sehen sofort
              die Karte.
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Mobil-optimiert</h3>
            <p className="text-sm text-muted-foreground">
              Responsive Design für alle Geräte. Kein App-Download nötig.
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Allergen-Pflicht</h3>
            <p className="text-sm text-muted-foreground">
              Alle 14 EU-Hauptallergene integriert. Erfülle die
              Kennzeichnungspflicht einfach digital.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        © 2026 QR-Speisekarte
      </footer>
    </div>
  );
}
