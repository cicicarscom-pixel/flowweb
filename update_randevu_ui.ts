const f = 'C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx';
let c = await Deno.readTextFile(f);

const targetSvcName = "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : ((appt.service_id && getServiceName(appt.service_id)) || (appt.customer_request_raw ? `?? Not: ${appt.customer_request_raw}` : t('randevuPage.timeline.unknownService')));";

const newSvcName = `const getServiceLabel = (appt: any) => {
                  if (appt.services?.length > 0) return appt.services.join(' + ');
                  if (appt.service_id && getServiceName(appt.service_id)) return getServiceName(appt.service_id);
                  if (appt.customer_request_raw?.trim()) return \`📝 Not: \${appt.customer_request_raw.trim()}\`;
                  return t('randevuPage.timeline.unknownService');
                };
                const svcName = getServiceLabel(appt);`;

c = c.replace(targetSvcName, newSvcName);

// Also fix time display logic
const targetTimeStr = `const timeStr = rawTime.substring(0, 5);`;
const newTimeStr = `const timeStr = appt.starts_at ? new Date(appt.starts_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: appt.timezone ?? "Europe/Istanbul" }) : rawTime.substring(0, 5);`;

c = c.replace(targetTimeStr, newTimeStr);

await Deno.writeTextFile(f, c);
console.log("Updated RandevuClient.tsx");
