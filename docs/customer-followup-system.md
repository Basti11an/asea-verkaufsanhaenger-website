# ASEA Kunden- und Bewertungs-Follow-up-System

Diese Datei dokumentiert die technische Umsetzung der Kundenverwaltung und automatischen Bewertungs-Follow-ups.

## Neue Tabellen

### `public.customers`

Speichert nur die fuer das Bewertungs-/Follow-up-System erforderlichen Kundendaten:

- `id`
- `name`
- `email`
- `email_normalized` als generierte Normalisierungs-Spalte
- `purchase_date`
- `purchased_item`
- `notes`
- `preferred_language`
- Bewertungsstatus: `review_status`, `review_found_at`, `review_source`, `matched_reference_id`, `manual_review_confirmed_at`, `manual_review_source`
- Follow-up-Steuerung: `follow_up_enabled`, `follow_up_permission_status`, Nachweisfelder, `follow_up_opt_out`, `follow_up_opted_out_at`
- Reminder-Status fuer 2, 6 und 12 Monate: Status, Sendezeitpunkt, Versuchszahl und letzter Versuch
- `created_at`, `updated_at`, `deleted_at`

### `public.customer_followup_events`

Audit- und Statusereignisse ohne komplette Datensatz-Snapshots:

- Kunde erstellt/geaendert/geloescht
- Follow-up aktiviert/deaktiviert
- Versandberechtigung geaendert
- Bewertung erkannt oder manuell bestaetigt
- Reminder gesendet/fehlgeschlagen/uebersprungen
- Opt-out verarbeitet

Es werden keine vollstaendigen Kundendaten, E-Mail-Inhalte oder Token gespeichert.

### `public.customer_followup_unsubscribe_tokens`

Speichert nur Hashes zufaelliger Abmelde-Tokens:

- `customer_id`
- `token_hash`
- `created_at`
- `used_at`

Der Klartext-Token steht nur im E-Mail-Link und wird nicht in der Datenbank gespeichert.

### `public.customer_review_tokens`

Speichert nur Hashes zufaelliger Bewertungs-Tokens:

- `customer_id`
- `token_hash`
- `reminder_stage`
- `created_at`
- `used_at`

Der Klartext-Token steht nur im persoenlichen Link `/bewertung?token=...`. In der URL stehen keine E-Mail-Adressen und keine Kunden-IDs.

## Geaenderte Tabelle

### `public.customer_references`

Ergaenzte interne Felder:

- `customer_id`
- `kontakt_email_normalized`
- `review_matched_at`
- `rating`
- `public_consent`

Die oeffentliche View `customer_references_public` liefert weiterhin nur freigegebene, sichtbare und explizit oeffentliche Felder aus. Bewertungen ohne Zustimmung (`public_consent = false`) bleiben auch dann oeffentlich unsichtbar, wenn sie intern im Adminbereich vorhanden sind. Private Kontaktfelder, interne Kunden-IDs und Matching-Daten werden dort nicht ausgegeben.

## RLS und Rechte

RLS ist fuer alle neuen Tabellen aktiv.

- `anon`: kein Zugriff auf `customers`, `customer_followup_events`, `customer_followup_unsubscribe_tokens` oder `customer_review_tokens`
- normale `authenticated` User: kein Zugriff, solange `public.is_admin()` false ist
- ASEA-Admins: Verwaltung ueber RLS-Policies mit `public.is_admin()`
- Audit-Events werden automatisch durch Trigger und Serverfunktionen geschrieben; der Adminbereich liest sie nur
- Cron/API: serverseitig ueber `SUPABASE_SERVICE_ROLE_KEY`, nicht im Frontend

Die bestehenden `admin_users` und `public.is_admin()` werden weiterverwendet.

## RPC-Funktionen

### `public.unsubscribe_customer_followup(p_token text)`

Oeffentlich ausfuehrbar, aber gibt keine Kundendaten preis. Der Token wird gehasht, mit gespeicherten Token-Hashes verglichen und setzt bei Treffer:

- `follow_up_opt_out = true`
- `follow_up_enabled = false`
- `follow_up_permission_status = 'revoked'`

Die Funktion ist idempotent und antwortet neutral.

### `public.claim_due_customer_reminders(p_limit integer)`

Nur fuer `service_role`. Waehlt faellige Reminder mit serverseitigen Stop-Regeln und markiert sie atomar als `processing`.

### `public.verify_customer_reminder_claim(p_customer_id bigint, p_stage text)`

Nur fuer `service_role`. Prueft unmittelbar vor dem Senden erneut, ob kein Stop-Grund eingetreten ist.

### `public.register_customer_unsubscribe_token(p_customer_id bigint, p_token_hash text)`

Nur fuer `service_role`. Speichert den Hash eines neuen Abmelde-Tokens.

### `public.register_customer_review_token(p_customer_id bigint, p_token_hash text, p_reminder_stage text)`

Nur fuer `service_role`. Speichert den Hash eines neuen Bewertungs-Tokens fuer den persoenlichen Bewertungslink.

### `public.submit_customer_review_with_token(...)`

Oeffentlich ausfuehrbar, aber gibt keine Kundendaten aus. Die Funktion hasht den eingehenden Token, sucht den passenden Kunden intern, speichert die Bewertung als `pending`/`sichtbar = false`, verknuepft sie mit dem Kunden und deaktiviert weitere automatische Reminder.

### `public.record_customer_reminder_result(...)`

Nur fuer `service_role`. Markiert Reminder als `sent`, `failed` oder `skipped` und schreibt ein Auditereignis.

## Cronjob und Server-Route

Die Vercel-Route `api/customer-followups.ts` wird ueber `vercel.json` einmal taeglich ausgefuehrt:

```text
31 4 * * *
```

Ablauf:

1. Vercel Cron ruft `/api/customer-followups` auf.
2. Die Route prueft `CRON_SECRET`.
3. Faellige Reminder werden per RPC atomar beansprucht.
4. Vor jedem Mailversand wird der Status erneut geprueft.
5. Ein zufaelliger Bewertungs-Token und ein zufaelliger Abmelde-Token werden erzeugt und nur als Hash gespeichert.
6. Der Bewertungsbutton zeigt auf `/bewertung?token=...`.
7. Die Mail wird serverseitig ueber Resend gesendet.
8. Erfolg oder Fehler wird in Supabase dokumentiert.

## Environment Variables

Frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- bestehende EmailJS-Variablen fuer Kontaktformular

Server-only in Vercel:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `SITE_URL`
- `RESEND_API_KEY`
- `FOLLOWUP_FROM_EMAIL`
- `FOLLOWUP_REPLY_TO_EMAIL`

`SUPABASE_SERVICE_ROLE_KEY` und `RESEND_API_KEY` duerfen niemals als `VITE_...` Variable angelegt werden.

## Bewertungsabgleich

E-Mail-Adressen werden intern mit `trim + lowercase` normalisiert. Wenn eine neue Bewertung in `customer_references` eingeht und die interne Kontakt-E-Mail eindeutig zu einem Kunden passt, wird dieser Kunde automatisch als bewertet markiert:

```text
review_status = auto_matched
review_source = asea_website
review_found_at = now()
```

Oeffentlich wird diese interne Zuordnung nicht ausgegeben.

Wenn ein Admin die E-Mail-Adresse eines Kunden aendert, prueft die Datenbank die vorhandenen internen Bewertungs-E-Mails erneut und aktualisiert die Zuordnung.

## Stop-Regeln

Automatische Mails stoppen, sobald eine dieser Bedingungen zutrifft:

- Bewertung automatisch gefunden
- Bewertung manuell bestaetigt
- Kunde hat widersprochen
- Follow-up wurde deaktiviert
- Versandberechtigung fehlt
- 12-Monats-Mail wurde bereits gesendet
- Kunde wurde geloescht

Die Regeln liegen in SQL fuer den Cron und in `src/app/lib/customerFollowup.ts` fuer Adminanzeige und Tests.

## E-Mail-Infrastruktur

Das bestehende Kontaktformular verwendet weiter EmailJS.

Automatische Bewertungs-Follow-ups verwenden serverseitig Resend, damit kein privater Mail-Key im Frontend landet. Der Resend-Key muss als serverseitiges Vercel Secret hinterlegt werden.

## Testmail sicher senden

Der sicherste Test laeuft ueber die normale Follow-up-Route, damit echte Bewertungs- und Abmelde-Tokens erzeugt werden:

1. Lege im Adminbereich einen Testkunden mit deiner eigenen E-Mail-Adresse an.
2. Setze das Kaufdatum testweise mindestens zwei Monate in die Vergangenheit.
3. Stelle sicher, dass die Follow-up-Erlaubnis dokumentiert ist und noch keine Bewertung vorhanden ist.
4. Rufe die geschuetzte Vercel-Route einmal manuell auf:

```powershell
$headers = @{ Authorization = "Bearer DEIN_CRON_SECRET" }
Invoke-WebRequest -Uri "https://DEINE-DOMAIN/api/customer-followups" -Headers $headers -Method GET
```

Dabei koennen alle faelligen Testkunden verarbeitet werden. Fuer einen sauberen Einzeltest sollte vorher nur dein Testkunde faellig sein.
