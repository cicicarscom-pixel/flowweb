const f = 'C:/Users/roman/flowweb/src/app/(dashboard)/musteriler/MusterilerClient.tsx';
let c = await Deno.readTextFile(f);

c = c.replace(
  "{appt.services?.length > 0 ? appt.services.join(' + ') : t('musteriler.unknownService')}",
  "{appt.services?.length > 0 ? appt.services.join(' + ') : (appt.customer_request_raw ? `📝 Not: ${appt.customer_request_raw}` : t('musteriler.unknownService'))}"
);

c = c.replace(
  "{customer.phone}",
  "{customer.phone?.replace('@c.us', '')}"
);

c = c.replace(
  "{selectedCustomer.phone}",
  "{selectedCustomer.phone?.replace('@c.us', '')}"
);

await Deno.writeTextFile(f, c);
console.log("Updated MusterilerClient.tsx");
