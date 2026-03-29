/**
 * Client-safe template rendering for preview purposes.
 * Does not import server-only dependencies (Resend, db).
 */
export function renderTemplate(
  template: string,
  placeholders: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => placeholders[key] ?? "");
}
