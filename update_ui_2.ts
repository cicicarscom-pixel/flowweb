const file = 'C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx';
let content = await Deno.readTextFile(file);

const originalGetSvc = `const getServiceName = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    return s ? s.name : t('randevuPage.timeline.unknownService');
  };`;
const newGetSvc = `const getServiceName = (serviceId: string) => {
    const s = services.find(x => x.id === serviceId);
    return s ? s.name : null;
  };`;
content = content.replace(originalGetSvc, newGetSvc);

const originalSvcName = "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : (appt.service_id ? getServiceName(appt.service_id) : (appt.customer_request_raw ? `📝 Not: ${appt.customer_request_raw}` : t('randevuPage.timeline.unknownService')));";
const newSvcName = "const svcName = appt.services?.length > 0 ? appt.services.join(' + ') : ((appt.service_id && getServiceName(appt.service_id)) || (appt.customer_request_raw ? `📝 Not: ${appt.customer_request_raw}` : t('randevuPage.timeline.unknownService')));";
content = content.replace(originalSvcName, newSvcName);

await Deno.writeTextFile(file, content);
console.log("Updated flowweb RandevuClient.tsx!");
