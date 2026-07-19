Hier ist alles in einem einzigen vollständigen Prompt:

---

Build a complete, minimalist admin dashboard to replace the currently empty admin area, AND create a separate AdminHeader component that replaces the normal header when the user is logged in. Everything must use the existing shadcn/ui component library and match the overall code style of the project.

---

**PART 1 — AdminHeader component**

Create a new file `components/AdminHeader.tsx`. This header replaces the normal Header.tsx when the admin is logged in — Header.tsx must remain completely unchanged and is simply not rendered in admin mode.

Design rules for AdminHeader:
- Background: dark steel-blue (#1e2a3a) — clearly different from the website's normal dark charcoal header so the user always knows they are in the backend
- Height: slightly more compact than the normal header
- Font: use monospace for the brand label only
- Left side: a small `Lock` icon (lucide-react) followed by the text "ASEA Admin" in monospace — makes it clear this is a restricted backend area
- Center: horizontal navigation tabs for the four admin sections. Use text labels only, no icons. The active tab gets a bottom border in the rust-orange accent color (#b84c1e). The tabs are: "Anfragen" (with a small Badge showing the count of entries with status "Neu"), "Modelle", "Ausstattung", "Referenzen"
- Right side: two buttons side by side:
  — "← Startseite" — outlined style, white border, white text, navigates back to the homepage via onNavigate('home') — this is how the user returns to the public website
  — "Abmelden" — muted red background, logs out the admin and returns to the AdminLogin screen
- No logo, no mobile hamburger menu
- Pass props to AdminHeader: activeTab, setActiveTab, onNavigate, onLogout, newRequestCount

Integration in App.tsx:
- When admin is logged in, render `<AdminHeader />` instead of `<Header />`
- The activeTab state lives in App.tsx and is passed down to both AdminHeader and the admin dashboard content area
- Clicking a tab in AdminHeader updates activeTab and renders the correct content below

---

**PART 2 — Admin dashboard content (four tabs)**

The content area below AdminHeader renders one of four tab views based on activeTab. All data lives in React useState — no backend, no API calls needed.

**TAB 1 — Anfragen**

A table of incoming contact form submissions with columns: Datum, Name, E-Mail, Telefon, Nachricht (truncated to 60 chars), Konfiguration (short summary if sent from configurator, otherwise "–"), Status shown as a Badge (Neu = blue, Bearbeitet = green, Archiviert = gray with line-through row styling).

Pre-fill with 5 realistic mock entries using Austrian names, phone numbers and short messages. Add a filter row above the table to filter by Status. Each row has two buttons: "Ansehen" opens a Dialog showing the full message and configuration details, "Archivieren" marks the entry as archived.

**TAB 2 — Modelle**

Show the three trailer models as editable cards side by side:
- Verkaufsanhänger — description: "Unsere Verkaufsanhänger sind Ihr praktischer Begleiter bei Ihren Verkaufstouren. Besonders wenig Eigengewicht für maximalen Warentransport." — image URL: https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-85.jpg
- Kühlanhänger — description: "Mit unseren Kühlanhänger bringen Sie jede Ware bestens zum gewünschten Lieferort. Egal ob Getränke oder Lebensmittel, Ihre Lieferung bleibt frisch." — image URL: https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-2-1.jpg
- Messe- und Präsentationsanhänger — description: "Optimal für jedes Event ausgerüstet, mit eigener Elektrik für Outdoor-Events. Höchste Qualität zum fairen Preis-Leistungs-Verhältnis." — image URL: https://www.verkaufsanhaenger-asea.at/wp/wp-content/uploads/Verkaufsanhaenger-Asea-aus-Waldburg-in-Oberoesterreich-4-2.jpg

Each card has: editable name field, editable textarea for description, editable image URL field with a small live thumbnail preview, and a "Änderungen speichern" button that shows a green success toast on click.

**TAB 3 — Ausstattung**

An editable table with columns: Name, Beschreibung, Preis (€), Kategorie, Aktiv (Switch toggle). Pre-fill with 8 realistic equipment items: Kühlvitrine (Kühlung, €1.200), Fritteuse (Küche, €450), Warmhaltebehälter (Küche, €280), Zapfanlage (Getränke, €890), LED-Beleuchtung (Elektrik, €320), Markise (Außen, €560), Edelstahltheke (Einrichtung, €740), Kassenlade (Elektrik, €180). Each row has "Bearbeiten" (inline edit mode) and "Löschen" (requires confirm Dialog) buttons. An "Neuen Eintrag hinzufügen" button above the table adds a new empty editable row.

**TAB 4 — Referenzen**

A table with columns: Kundenname, Ort, Modell, Jahr, Beschreibung, Bild-URL, Sichtbar (Switch). Pre-fill with 6 realistic Austrian mock customers: "Würstelstand Huber" (Wien, Verkaufsanhänger, 2023), "Café Moser" (Salzburg, Messe- und Präsentationsanhänger, 2022), "Getränke Steinbauer" (Linz, Kühlanhänger, 2024), "Imbiss Kowalski" (Graz, Verkaufsanhänger, 2023), "Bäckerei Pichler" (Wels, Verkaufsanhänger, 2022), "Eventservice Huemer" (Innsbruck, Messe- und Präsentationsanhänger, 2024). Each row has "Bearbeiten" and "Löschen" buttons. A "Neue Referenz hinzufügen" button adds a new empty row.

---

**Global technical rules:**
- All data in React useState only
- Use existing shadcn/ui components: Table, Dialog, Input, Textarea, Button, Badge, Switch, Tabs, Toast (Sonner)
- Success feedback via brief green toast "Gespeichert ✓"
- All destructive actions require a confirm Dialog before executing
- AdminLogin.tsx and its logic remain completely unchanged
- Do NOT touch: Header.tsx, Footer.tsx, TrailerConfigurator.tsx, TrailerScene.tsx, or any public-facing page component
- The existing MessagesPage.tsx can be replaced by the new Anfragen tab