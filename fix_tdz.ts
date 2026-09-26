let c = Deno.readTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx');

c = c.replace(/(\s*)const searchParams = useSearchParams\(\);/, "");

c = c.replace(
  "const initialDateFromParam = () => {",
  "const searchParams = useSearchParams();\n\n    const initialDateFromParam = () => {"
);

Deno.writeTextFileSync('C:/Users/roman/flowweb/src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx', c);
console.log("Updated RandevuClient.tsx");
