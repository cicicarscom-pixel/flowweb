const repoFile = 'C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx';
let repoContent = await Deno.readTextFile(repoFile);

const originalLogic = "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : getServiceName(appt.service_id);";
const newLogic = "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : (appt.service_id ? getServiceName(appt.service_id) : (appt.customer_request_raw ? `📝 Not: ${appt.customer_request_raw}` : t('randevuPage.timeline.unknownService')));";

if (repoContent.includes(originalLogic)) {
  repoContent = repoContent.replace(originalLogic, newLogic);
  await Deno.writeTextFile(repoFile, repoContent);
  console.log("Updated Web UI successfully!");
} else {
  console.log("Could not find the logic in Web UI!");
}
