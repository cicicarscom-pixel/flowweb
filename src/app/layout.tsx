import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://flow.workigom.com"),
  title: "Workigom Flow",
  description: "Workigom Flow Dashboard",
  openGraph: {
    title: "Workigom Flow",
    description: "Workigom Flow Dashboard",
    url: "https://flow.workigom.com",
    siteName: "Workigom Flow",
    images: [
      {
        url: "/google.jpg",
        width: 1200,
        height: 630,
        alt: "Workigom Flow Logo",
      }
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workigom Flow",
    description: "Workigom Flow Dashboard",
    images: ["/google.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-body-md text-body-md min-h-screen w-full flex bg-background text-on-background overflow-hidden">
        {children}
      </body>
    </html>
  );
}


