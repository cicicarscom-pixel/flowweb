import { assertEquals } from "https://deno.land/std@0.220.0/testing/asserts.ts";
import { addDaysYmd, dateFromYmd, todayInTimezone } from "./dates.ts";

// Deno testi: GERÇEK `dates.ts` modülünü sınar (önceden fonksiyonların kopyasını sınıyordu).
// Çalıştırma: deno test src/lib/dates.test.ts

Deno.test("todayInTimezone - Istanbul edge case (next day locally)", () => {
  // Istanbul is UTC+3. At 22:30 UTC, it's 01:30 the next day locally.
  const d = new Date('2026-09-26T22:30:00Z');
  const res = todayInTimezone('Europe/Istanbul', d);
  assertEquals(res, "2026-09-27");
});

Deno.test("todayInTimezone - Istanbul edge case (same day locally)", () => {
  // At 20:30 UTC, it's 23:30 locally.
  const d = new Date('2026-09-26T20:30:00Z');
  const res = todayInTimezone('Europe/Istanbul', d);
  assertEquals(res, "2026-09-26");
});

Deno.test("todayInTimezone - New York edge case (previous day locally)", () => {
  // New York is UTC-4 (or -5). At 02:00 UTC, it's 22:00 (or 21:00) the previous day locally.
  const d = new Date('2026-10-01T02:00:00Z');
  const res = todayInTimezone('America/New_York', d);
  assertEquals(res, "2026-09-30");
});

Deno.test("dateFromYmd - robust parsing", () => {
  const d = dateFromYmd('2026-10-01');
  assertEquals(d.getMonth(), 9); // October is 9
  assertEquals(d.getDate(), 1);
});

Deno.test('addDaysYmd', () => {
  assertEquals(addDaysYmd('2026-12-31', 1), '2027-01-01');
  assertEquals(addDaysYmd('2026-09-30', 1), '2026-10-01');
  assertEquals(addDaysYmd('2026-10-01', -1), '2026-09-30');
});

