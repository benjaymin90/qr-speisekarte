import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UtensilsCrossed,
  QrCode,
  Smartphone,
  Shield,
  Languages,
  Palette,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR-Codes fuer jeden Tisch",
    description:
      "Generieren Sie individuelle QR-Codes fuer jeden Tisch. Gaeste scannen und sehen sofort Ihre aktuelle Speisekarte.",
  },
  {
    icon: Smartphone,
    title: "Mobil-optimiert",
    description:
      "Responsive Design fuer alle Geraete — Smartphone, Tablet und Desktop. Kein App-Download noetig.",
  },
  {
    icon: Shield,
    title: "Allergen-Kennzeichnung",
    description:
      "Alle 14 EU-Hauptallergene integriert. Erfuellen Sie die gesetzliche Kennzeichnungspflicht einfach digital.",
  },
  {
    icon: Languages,
    title: "Mehrsprachig",
    description:
      "Bieten Sie Ihre Speisekarte in mehreren Sprachen an — ideal fuer Touristen und internationale Gaeste.",
  },
  {
    icon: Palette,
    title: "Individuelles Design",
    description:
      "Passen Sie Farben, Logo und Layout an Ihr Restaurant an. Ihre Marke, Ihre Speisekarte.",
  },
  {
    icon: UtensilsCrossed,
    title: "Echtzeit-Aktualisierung",
    description:
      "Aendern Sie Gerichte, Preise und Verfuegbarkeit sofort — ohne Neudruck, ohne Wartezeit.",
  },
];

const pricingFeatures = [
  { name: "Speisekarten", free: "1", pro: "Unbegrenzt" },
  { name: "QR-Codes", free: "5", pro: "Unbegrenzt" },
  { name: "Kategorien & Gerichte", free: true, pro: true },
  { name: "Allergen-Kennzeichnung", free: true, pro: true },
  { name: "Mobil-optimierte Ansicht", free: true, pro: true },
  { name: "Eigenes Logo & Farben", free: false, pro: true },
  { name: "Mehrsprachigkeit", free: false, pro: true },
  { name: "Bewerbungsportal", free: false, pro: true },
  { name: "Prioritaets-Support", free: false, pro: true },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="text-lg">QR-Speisekarte</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Anmelden</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Kostenlos starten</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-4">
              Jetzt in der Beta — kostenlos testen
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Digitale Speisekarte
              <br className="hidden sm:block" /> per{" "}
              <span className="text-primary">QR-Code</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              QR-Speisekarte ist die moderne Loesung fuer die deutsche
              Gastronomie. Erstellen Sie Ihre digitale Speisekarte in Minuten
              — mit Allergen-Kennzeichnung, mehreren Sprachen und
              Echtzeit-Updates.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Kostenlos starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/m/demo">Demo ansehen</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Keine Kreditkarte erforderlich. Kostenloser Plan verfuegbar.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Alles fuer Ihre digitale Speisekarte
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Von QR-Code-Generierung bis Allergen-Management — alles in
                einer einfachen App.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base mt-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="preise" className="border-t py-20 scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Einfache, transparente Preise
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Starten Sie kostenlos und upgraden Sie, wenn Ihr Restaurant
                waechst.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Free */}
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fuer den Einstieg
                  </p>
                  <div className="pt-2">
                    <span className="text-4xl font-bold">0&nbsp;&euro;</span>
                    <span className="text-muted-foreground">/Monat</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sign-up">Kostenlos registrieren</Link>
                  </Button>
                  <ul className="space-y-3">
                    {pricingFeatures.map((f) => (
                      <li
                        key={f.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        {f.free ? (
                          <Check className="h-4 w-4 text-green-600 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        )}
                        <span
                          className={!f.free ? "text-muted-foreground/60" : ""}
                        >
                          {f.name}
                          {typeof f.free === "string" && (
                            <span className="text-muted-foreground ml-1">
                              ({f.free})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pro */}
              <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Empfohlen</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fuer aktive Restaurants
                  </p>
                  <div className="pt-2">
                    <span className="text-4xl font-bold">
                      12,99&nbsp;&euro;
                    </span>
                    <span className="text-muted-foreground">/Monat</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link href="/sign-up">Jetzt upgraden</Link>
                  </Button>
                  <ul className="space-y-3">
                    {pricingFeatures.map((f) => (
                      <li
                        key={f.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <span>
                          {f.name}
                          {typeof f.pro === "string" && (
                            <span className="text-muted-foreground ml-1">
                              ({f.pro})
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Bereit fuer die digitale Speisekarte?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Erstellen Sie Ihre QR-Speisekarte in wenigen Minuten. Kostenlos
              starten — kein Risiko.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Jetzt kostenlos registrieren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UtensilsCrossed className="h-4 w-4" />
              <span>&copy; {new Date().getFullYear()} QR-Speisekarte</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="/sign-in"
                className="hover:text-foreground transition-colors"
              >
                Anmelden
              </Link>
              <Link
                href="/sign-up"
                className="hover:text-foreground transition-colors"
              >
                Registrieren
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
