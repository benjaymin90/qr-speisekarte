import { getTemplates } from "./actions";
import { TemplateList } from "./template-list";

export default async function EmailVorlagenPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">E-Mail-Vorlagen</h1>
        <p className="text-muted-foreground">
          Erstelle und verwalte E-Mail-Vorlagen für automatische
          Benachrichtigungen an Bewerber.
        </p>
      </div>
      <TemplateList initialTemplates={JSON.parse(JSON.stringify(templates))} />
    </div>
  );
}
