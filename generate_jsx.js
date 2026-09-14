const fs = require('fs');

let html = fs.readFileSync('C:/Users/roman/Downloads/Main-html/Main.dc.html', 'utf8');

// extract styles
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

// extract x-dc content
const xdcMatch = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
let innerBody = xdcMatch ? xdcMatch[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '') : html;

const pageCode = `
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: \`${styles.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      <div dangerouslySetInnerHTML={{ __html: \`${innerBody.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', pageCode);
console.log('Done');
