import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Download, Printer } from "lucide-react";

// Placeholder data
const qrCodes = [
  { id: "1", label: "Tisch 1", lastScan: "Heute, 10:32" },
  { id: "2", label: "Bar", lastScan: "Heute, 09:55" },
  { id: "3", label: "Terrasse", lastScan: "Gestern, 18:14" },
];

export default function QrCodesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QR-Codes</h1>
          <p className="text-muted-foreground">
            Erstelle und verwalte QR-Codes für deine Tische.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          QR-Code erstellen
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {qrCodes.map((qr) => (
          <Card key={qr.id}>
            <CardHeader>
              <CardTitle className="text-base">{qr.label}</CardTitle>
              <CardDescription>Letzter Scan: {qr.lastScan}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-center rounded-lg border border-border bg-white p-6">
                <div className="h-32 w-32 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Printer className="h-4 w-4" />
                  Drucken
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
