"use client";

import { useState } from "react";
import { createTemplate, updateTemplate, deleteTemplate } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { renderTemplate } from "@/lib/email-preview";

const TEMPLATE_TYPES = {
  BESTAETIGUNG: { label: "Bestätigung", color: "bg-green-500/10 text-green-700" },
  ABSAGE: { label: "Absage", color: "bg-red-500/10 text-red-700" },
  EINLADUNG: { label: "Einladung", color: "bg-blue-500/10 text-blue-700" },
  STATUS_UPDATE: { label: "Status-Update", color: "bg-yellow-500/10 text-yellow-700" },
  ANGEBOT: { label: "Angebot", color: "bg-purple-500/10 text-purple-700" },
} as const;

const PLACEHOLDER_PREVIEW: Record<string, string> = {
  vorname: "Max",
  nachname: "Mustermann",
  name: "Max Mustermann",
  email: "max@example.com",
  stelle: "Koch (Vollzeit)",
  status: "INTERVIEW",
};

type Template = {
  id: string;
  type: keyof typeof TEMPLATE_TYPES;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export function TemplateList({
  initialTemplates,
}: {
  initialTemplates: Template[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");

  function handleEdit(template: Template) {
    setEditingTemplate(template);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingTemplate(null);
    setDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Vorlage wirklich löschen?")) return;
    await deleteTemplate(id);
  }

  async function handleSubmit(formData: FormData) {
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, formData);
    } else {
      await createTemplate(formData);
    }
    setDialogOpen(false);
    setEditingTemplate(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Vorlage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Vorlage bearbeiten" : "Neue Vorlage"}
              </DialogTitle>
            </DialogHeader>
            <TemplateForm
              template={editingTemplate}
              onSubmit={handleSubmit}
              onPreview={setPreviewHtml}
              previewHtml={previewHtml}
            />
          </DialogContent>
        </Dialog>
      </div>

      {initialTemplates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Keine Vorlagen vorhanden</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle deine erste E-Mail-Vorlage für automatische
            Bewerber-Benachrichtigungen.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {initialTemplates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{template.name}</h3>
                    <Badge
                      variant="secondary"
                      className={TEMPLATE_TYPES[template.type]?.color}
                    >
                      {TEMPLATE_TYPES[template.type]?.label ?? template.type}
                    </Badge>
                    {template.isDefault && (
                      <Badge variant="outline">Standard</Badge>
                    )}
                    {!template.isActive && (
                      <Badge variant="destructive">Inaktiv</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Betreff: {template.subject}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(template)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateForm({
  template,
  onSubmit,
  onPreview,
  previewHtml,
}: {
  template: Template | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onPreview: (html: string) => void;
  previewHtml: string;
}) {
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [body, setBody] = useState(template?.body ?? "");

  function handlePreview() {
    const rendered = renderTemplate(body, PLACEHOLDER_PREVIEW);
    onPreview(rendered);
  }

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
        <TabsTrigger value="preview" onClick={handlePreview}>
          <Eye className="mr-1 h-3 w-3" />
          Vorschau
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <form action={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={template?.name ?? ""}
                placeholder="z.B. Interview-Einladung Standard"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select
                name="type"
                defaultValue={template?.type ?? "BESTAETIGUNG"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEMPLATE_TYPES).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Betreff</Label>
            <Input
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="z.B. Einladung zum Vorstellungsgespräch — {{stelle}}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Inhalt (HTML)</Label>
            <Textarea
              id="body"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="<p>Sehr geehrte/r {{vorname}} {{nachname}},</p>"
              rows={12}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Verfügbare Platzhalter:{" "}
              {"{{vorname}}, {{nachname}}, {{name}}, {{email}}, {{stelle}}, {{status}}"}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isDefault"
                name="isDefault"
                defaultChecked={template?.isDefault ?? false}
              />
              <Label htmlFor="isDefault">Standard-Vorlage</Label>
            </div>
            {template && (
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={template.isActive}
                />
                <Label htmlFor="isActive">Aktiv</Label>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {template ? "Speichern" : "Erstellen"}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="preview">
        <div className="space-y-4">
          <div className="rounded-md border p-3 bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Betreff:</p>
            <p className="text-sm">
              {renderTemplate(subject, PLACEHOLDER_PREVIEW)}
            </p>
          </div>
          <div
            className="rounded-md border p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: previewHtml || renderTemplate(body, PLACEHOLDER_PREVIEW),
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
