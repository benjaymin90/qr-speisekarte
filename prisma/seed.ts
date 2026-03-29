import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
  const db = new PrismaClient({ adapter });

  // Demo restaurant (clerkUserId "demo" for seed data / guest view)
  const restaurant = await db.restaurant.upsert({
    where: { clerkUserId: "demo" },
    update: {},
    create: {
      clerkUserId: "demo",
      name: "Trattoria Bella Vista",
      currency: "EUR",
      locale: "de",
    },
  });

  console.log(`Restaurant: ${restaurant.name} (${restaurant.id})`);

  // Menu
  const menu = await db.menu.upsert({
    where: {
      restaurantId_slug: {
        restaurantId: restaurant.id,
        slug: "demo",
      },
    },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: "Speisekarte",
      slug: "demo",
      isActive: true,
    },
  });

  // Categories
  const categories = await Promise.all(
    [
      { name: "Vorspeisen", sortOrder: 1 },
      { name: "Pasta", sortOrder: 2 },
      { name: "Hauptgerichte", sortOrder: 3 },
      { name: "Desserts", sortOrder: 4 },
      { name: "Getranke", sortOrder: 5 },
    ].map((cat) =>
      db.category.upsert({
        where: {
          id: `seed-${cat.name.toLowerCase().replace(/ä/g, "ae")}`,
        },
        update: {},
        create: {
          id: `seed-${cat.name.toLowerCase().replace(/ä/g, "ae")}`,
          restaurantId: restaurant.id,
          name: cat.name,
          sortOrder: cat.sortOrder,
        },
      }),
    ),
  );

  const [vorspeisen, pasta, hauptgerichte, desserts, getraenke] = categories;

  // Dishes
  const dishes = [
    // Vorspeisen
    {
      categoryId: vorspeisen.id,
      name: "Bruschetta Classica",
      description:
        "Gerostetes Ciabatta mit Tomaten, Knoblauch, Basilikum und Olivenol",
      price: 8.5,
      allergens: ["A", "L"],
      sortOrder: 1,
    },
    {
      categoryId: vorspeisen.id,
      name: "Caprese",
      description: "Buffel-Mozzarella mit Tomaten und frischem Basilikum",
      price: 10.5,
      allergens: ["G"],
      sortOrder: 2,
    },
    {
      categoryId: vorspeisen.id,
      name: "Minestrone",
      description: "Italienische Gemusesuppe mit saisonalem Gemuse",
      price: 7.0,
      allergens: ["I", "L"],
      sortOrder: 3,
    },
    // Pasta
    {
      categoryId: pasta.id,
      name: "Spaghetti Carbonara",
      description: "Mit Guanciale, Eigelb, Pecorino und schwarzem Pfeffer",
      price: 14.5,
      allergens: ["A", "C", "G"],
      sortOrder: 1,
    },
    {
      categoryId: pasta.id,
      name: "Penne Arrabiata",
      description: "Scharfe Tomatensauce mit Knoblauch und Peperoncino",
      price: 12.0,
      allergens: ["A"],
      sortOrder: 2,
    },
    {
      categoryId: pasta.id,
      name: "Tagliatelle al Ragu",
      description: "Hausgemachte Bandnudeln mit Bolognese nach Nonna-Rezept",
      price: 15.5,
      allergens: ["A", "C", "G"],
      sortOrder: 3,
    },
    // Hauptgerichte
    {
      categoryId: hauptgerichte.id,
      name: "Saltimbocca alla Romana",
      description: "Kalbsschnitzel mit Salbei und Parmaschinken",
      price: 22.0,
      allergens: ["G"],
      sortOrder: 1,
    },
    {
      categoryId: hauptgerichte.id,
      name: "Branzino al Forno",
      description: "Gegrillter Wolfsbarsch mit Zitrone und Krautern",
      price: 24.5,
      allergens: ["D"],
      sortOrder: 2,
    },
    {
      categoryId: hauptgerichte.id,
      name: "Risotto ai Funghi Porcini",
      description: "Cremiges Steinpilzrisotto mit Parmesan",
      price: 18.0,
      allergens: ["G"],
      sortOrder: 3,
    },
    // Desserts
    {
      categoryId: desserts.id,
      name: "Tiramisu",
      description: "Klassisches Tiramisu mit Mascarpone und Espresso",
      price: 8.0,
      allergens: ["A", "C", "G"],
      sortOrder: 1,
    },
    {
      categoryId: desserts.id,
      name: "Panna Cotta",
      description: "Vanille-Panna-Cotta mit Waldbeerensauce",
      price: 7.5,
      allergens: ["G"],
      sortOrder: 2,
    },
    // Getranke
    {
      categoryId: getraenke.id,
      name: "Acqua Minerale (0,75l)",
      description: "San Pellegrino oder Panna",
      price: 4.5,
      allergens: [],
      sortOrder: 1,
    },
    {
      categoryId: getraenke.id,
      name: "Hauswein rot/weiss (0,2l)",
      description: "Montepulciano oder Pinot Grigio",
      price: 5.5,
      allergens: ["L"],
      sortOrder: 2,
    },
    {
      categoryId: getraenke.id,
      name: "Espresso",
      description: "Klassischer italienischer Espresso",
      price: 2.5,
      allergens: [],
      sortOrder: 3,
    },
  ];

  for (const dish of dishes) {
    await db.dish.create({
      data: {
        restaurantId: restaurant.id,
        ...dish,
      },
    });
  }

  console.log(`Seeded ${dishes.length} dishes across ${categories.length} categories`);

  // QR Codes
  const qrCodes = [
    { label: "Tisch 1" },
    { label: "Tisch 2" },
    { label: "Tisch 3" },
    { label: "Terrasse" },
    { label: "Bar" },
  ];

  for (const qr of qrCodes) {
    await db.qrCode.create({
      data: {
        restaurantId: restaurant.id,
        menuId: menu.id,
        label: qr.label,
      },
    });
  }

  console.log(`Seeded ${qrCodes.length} QR codes`);

  // ─── E-Mail-Vorlagen (BewerbungsBoard) ───

  const emailTemplates = [
    {
      id: "seed-tpl-bestaetigung",
      type: "BESTAETIGUNG" as const,
      name: "Bewerbungseingang bestätigen",
      subject: "Ihre Bewerbung als {{stelle}} — Eingangsbestätigung",
      body: `<p>Sehr geehrte/r {{vorname}} {{nachname}},</p>
<p>vielen Dank für Ihre Bewerbung als <strong>{{stelle}}</strong> bei uns.</p>
<p>Wir haben Ihre Unterlagen erhalten und werden diese sorgfältig prüfen. Sie hören in Kürze von uns.</p>
<p>Mit freundlichen Grüßen<br>Ihr HR-Team</p>`,
      isDefault: true,
    },
    {
      id: "seed-tpl-einladung",
      type: "EINLADUNG" as const,
      name: "Interview-Einladung Standard",
      subject: "Einladung zum Vorstellungsgespräch — {{stelle}}",
      body: `<p>Sehr geehrte/r {{vorname}} {{nachname}},</p>
<p>wir freuen uns, Sie zu einem Vorstellungsgespräch für die Position <strong>{{stelle}}</strong> einzuladen.</p>
<p>Bitte teilen Sie uns Ihre Verfügbarkeit mit, damit wir einen Termin vereinbaren können.</p>
<p>Mit freundlichen Grüßen<br>Ihr HR-Team</p>`,
      isDefault: true,
    },
    {
      id: "seed-tpl-absage",
      type: "ABSAGE" as const,
      name: "Absage Standard",
      subject: "Ihre Bewerbung als {{stelle}}",
      body: `<p>Sehr geehrte/r {{vorname}} {{nachname}},</p>
<p>vielen Dank für Ihr Interesse an der Position <strong>{{stelle}}</strong> und die Zeit, die Sie in Ihre Bewerbung investiert haben.</p>
<p>Nach sorgfältiger Prüfung müssen wir Ihnen leider mitteilen, dass wir uns für andere Kandidaten entschieden haben.</p>
<p>Wir wünschen Ihnen für Ihre berufliche Zukunft alles Gute.</p>
<p>Mit freundlichen Grüßen<br>Ihr HR-Team</p>`,
      isDefault: true,
    },
    {
      id: "seed-tpl-angebot",
      type: "ANGEBOT" as const,
      name: "Jobangebot",
      subject: "Jobangebot: {{stelle}}",
      body: `<p>Sehr geehrte/r {{vorname}} {{nachname}},</p>
<p>wir freuen uns, Ihnen ein Angebot für die Position <strong>{{stelle}}</strong> zu unterbreiten!</p>
<p>Bitte melden Sie sich bei uns, um die Details zu besprechen.</p>
<p>Mit freundlichen Grüßen<br>Ihr HR-Team</p>`,
      isDefault: true,
    },
  ];

  for (const tpl of emailTemplates) {
    await db.emailTemplate.upsert({
      where: { id: tpl.id },
      update: {},
      create: {
        id: tpl.id,
        restaurantId: restaurant.id,
        type: tpl.type,
        name: tpl.name,
        subject: tpl.subject,
        body: tpl.body,
        isDefault: tpl.isDefault,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${emailTemplates.length} email templates`);
  console.log("Seed complete!");

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
